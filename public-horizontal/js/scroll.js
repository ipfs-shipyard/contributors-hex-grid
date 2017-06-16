/* global $, Image, contributorsJson, requestAnimationFrame */

function transitionForProgressInRange (progress, startValue, endValue) {
  return startValue + (endValue - startValue) * progress
}
function progressForValueInRange (value, startValue, endValue) {
  return (value - startValue) / (endValue - startValue)
}
function clampedProgress (progress) {
  return progress < 0 ? 0 : progress > 1 ? 1 : progress
}

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
                                 window.mozRequestAnimationFrame ||
                                 window.oRequestAnimationFrame ||
                                 window.msRequestAnimationFrame ||
                                 function (callback) {
                                   setTimeout(callback, 100 / 6)
                                 }
}

var screens

$(function () {
  $(':root').addClass('is-ready')

  screens = $('section').toArray().map(function (screen) {
    return $(screen)
  })
})

var lastRenderTime
function recalculateScreens () {
  var renderTime = new Date()

  if ((!screens || !screens.length || lastRenderTime) && (renderTime - lastRenderTime) < (1000 / 60)) {
    return
  }

  lastRenderTime = renderTime

  screens.forEach(function (screen) {
    var progress = progressForValueInRange(this.wrapperHeight - this.y, screen[0].offsetTop, screen[0].offsetTop + screen[0].offsetHeight)

    if (screen.data('screen-progress') === progress) {
      return
    }

    screen.data('screen-progress', progress).trigger('screen-progress', {
      scroll: this,
      progress: progress
    })
  }, this)
}

$(window).on('scroll', function () {
  var root = $(':root')
  var body = $('body')
  recalculateScreens.call({
    wrapperHeight: body.height(),
    y: -root.scrollTop() || -body.scrollTop()
  })
})

function shuffle (array) {
  var currentIndex = array.length
  var temporaryValue
  var randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

function getContributorPositionByIndex (index) {
  var rows = 4
  var height = 23.073
  var width = 14.7
  return {
    left: (width * parseInt(index / rows) + index % 2 * width / 2) + '%',
    top: (index % rows * height) + '%'
  }
}
function getVisibleItemByShiftInLine (lineIndex, trueX, itemWidth, windowWidth) {
  return Math.floor((-trueX + (windowWidth || 0) - (lineIndex % 2 ? itemWidth / 2 : 0)) / itemWidth)
}
function contributorsFrame () {
  var date = new Date()
  if (contributorsFrame.lastDate && (date - contributorsFrame.lastDate) < 100 / 6) {
    return
  }
  contributorsFrame.lastDate = date

  var windowWidth = $(window).width()
  var contributors = contributorsAnimationFrame.contributors
  var x = contributors.get(0).x
  var items = contributorsAnimationFrame.items
  var item = contributorsAnimationFrame.item
  var slider = contributorsAnimationFrame.slider.css('transform', 'translateX(' + x.toFixed(2) + 'px)')

  var itemWidth = items.width() / 100 * 14.7
  var trueX = x + items.get(0).offsetLeft

  var prevLastIndex = contributorsFrame.lastIndex
  var prevIndex = contributorsFrame.index
  var lastIndex = contributorsFrame.lastIndex = Math.max(0, Math.min(Math.min(getVisibleItemByShiftInLine(0, trueX, itemWidth, windowWidth), item.length / 4 - 1) * 4 + 3, item.length))
  var index = contributorsFrame.index = Math.max(Math.min(lastIndex, Math.max(Math.max(0, getVisibleItemByShiftInLine(0, trueX, itemWidth)))) * 4 - 4, 0)

  if (prevIndex === void 0 && prevLastIndex === void 0) {
    slider.append(item.slice(index, lastIndex + 1))
  }

  item.slice(0, index).remove()
  if (index < prevIndex) {
    slider.append(item.slice(index, prevIndex))
  }

  item.slice(lastIndex + 1).remove()
  if (prevLastIndex < lastIndex) {
    slider.append(item.slice(prevLastIndex, lastIndex + 1))
  }

  item.slice(index, lastIndex + 1).each(function () {
    // scale
    var rect = this.getBoundingClientRect()
    $(this).css('transform', 'scale(' + transitionForProgressInRange(clampedProgress(Math.min(rect.left, windowWidth - rect.right) / this.offsetWidth), 0.7, 1).toFixed(3) + ')')

    //  lazy load
    if (this.__img.data('src')) {
      this.__img.attr('src', this.__img.data('src'))
      this.__img.data('src', null)
    }
  })

  //  loop
  if (!contributorsAnimationFrame.recalculate && (lastIndex - index) < 1) {
    contributorsAnimationFrame.recalculate = true

    var leftSort = contributorsAnimationFrame.leftSort

    contributors.get(0).x = contributorsAnimationFrame.direction
            ? windowWidth - items.get(0).offsetLeft - leftSort[0]
            : -items.get(0).offsetLeft - leftSort[leftSort.length - 1] + leftSort[0] - item.width()
  }
  if ((lastIndex - index) > 0) {
    contributorsAnimationFrame.recalculate = false
  }

  contributorsAnimationFrame.logo.css('opacity', +(trueX < 0 ? trueX + contributorsAnimationFrame.leftSort[contributorsAnimationFrame.leftSort.length - 1] + itemWidth < windowWidth / 3 : trueX > windowWidth / 3 * 2))
}
function contributorsAnimationFrame () {
  var step = contributorsAnimationFrame.step
  contributorsAnimationFrame.step = Math.max(0.5, Math.min(step + (contributorsAnimationFrame.paused ? -3 : 3), 1))
  if (!contributorsAnimationFrame.stopped) {
    $('.contributors').get(0).x -= contributorsAnimationFrame.step * (contributorsAnimationFrame.direction ? 1 : -1)
    contributorsFrame()
  }
  requestAnimationFrame(contributorsAnimationFrame)
}
contributorsAnimationFrame.direction = true
contributorsAnimationFrame.step = 0

$('.contributors')
    .each(function () {
      var figure = $('<div class="item"><a class="contributor" target="_blank"><figure><div class="hexagon-form"></div><figcaption><div class="hexagon-border-form"></div><span></span><div class="hexagon-form"></div></figcaption></figure></a></div>')

      contributorsAnimationFrame.contributors = $(this)

      var parent = contributorsAnimationFrame.contributors.find('.items')
      var slider = contributorsAnimationFrame.contributors.find('.item-slider')

      var items = contributorsJson
        // $.get('https://contributors.cloud.ipfs.team/contributors?org=all', function(items) {
      shuffle(items).slice(0, items.length - items.length % 4).forEach(function (item, index) {
        var itemNode = figure.clone()

        var img = new Image();
        (itemNode.get(0).__img = $(img)).attr('data-src', item.photo)
            // img.src = item.photo;
        img.onload = function () {
          itemNode.find('figure').addClass('is-loaded')
        }

        itemNode.find('figure > div').append(img)
        itemNode.find('figcaption span').text(item.username)

        itemNode.find('a').attr('href', item.url).attr('title', item.username)

        slider.append(itemNode.css(getContributorPositionByIndex(index)))
      })

      contributorsAnimationFrame.items = parent
      contributorsAnimationFrame.logo = parent.find('> svg')
      contributorsAnimationFrame.slider = slider
      contributorsAnimationFrame.item = parent.find('.item')
      contributorsAnimationFrame.leftSort = contributorsAnimationFrame.item.map(function () {
        return this.offsetLeft
      }).sort(function (a, b) {
        return a < b
                ? -1
                : a > b
                    ? 1
                    : 0
      })

      contributorsAnimationFrame.item.remove()
        // contributorsFrame();
      contributorsAnimationFrame()
        // });

      this.x = 0
    })
    .on('mousewheel', function (event) {
      if (!event.originalEvent.deltaX || Math.abs(event.originalEvent.deltaX) < Math.abs(event.originalEvent.deltaY)) {
        return
      }

      event.preventDefault()

      this.x -= event.originalEvent.deltaX

      contributorsAnimationFrame.stopped = true
      contributorsAnimationFrame.direction = event.originalEvent.deltaX > 0
      contributorsFrame()

      clearTimeout(this.framesTimer)
      this.framesTimer = setTimeout(function () {
        contributorsAnimationFrame.stopped = false
      }, 10)
    })
    .on('touchstart', function (event) {
      contributorsAnimationFrame.stopped = true
      contributorsAnimationFrame.startX = this.x
      contributorsAnimationFrame.touchX = event.touches[0].clientX
    })
    .on('touchend touchcancel', function () {
      contributorsAnimationFrame.stopped = false
      contributorsAnimationFrame.touchX = null
    })
    .on('touchmove', function (event) {
      var deltaX = event.touches[0].clientX - contributorsAnimationFrame.touchX
      this.x = contributorsAnimationFrame.startX + deltaX
      contributorsAnimationFrame.direction = deltaX < 0
      contributorsFrame()
    })
    .on('mouseover', '.contributor', function () {
      contributorsAnimationFrame.paused = true
    })
    .on('mouseout', '.contributor', function () {
      contributorsAnimationFrame.paused = false
    })

$(':root').addClass(('ontouchstart' in window || window.DocumentTouch) &&
  (document instanceof window.DocumentTouch || navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0) ? 'is-touch' : 'no-touch')
