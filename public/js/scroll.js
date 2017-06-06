/* global $, ga, Image, location, contributorsJson */

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
  window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    setTimeout(callback, 100 / 6)
  }
}

function trackClick (name) {
  ga('send', 'event', 'User Interaction', 'Click', name)
}

function scrollToElement (element, duration, centered) {
  element = $(element)

  $('html, body').animate({
    scrollTop: element.offset().top + (centered ? element.height() / 2 - $(window).height() / 2 : 0)
  }, duration)
}
function bgProgressFn (progress, isFirst) {
  return +clampedProgress(isFirst
        ? progressForValueInRange(progress, 1, 0.5)
        : progressForValueInRange(
            (progress < 0.5 || progress > 1.3) ? progress : 1,
            progress < 0.5 ? 0.3 : progress > 1.3 ? 1.5 : 0,
            progress < 0.5 ? 0.5 : progress > 1.3 ? 1.3 : 1
        )
    ).toFixed(2)
}

var headshotsShift = [
    [-12, -30],
    [-10, -40],
    [-8, -32],
    [2, -20],
    [6, -40],
    [16, -30],

    [-16, -50],
    [-20, -20],
    [-2, -20],
    [6, -10],
    [12, -20],
    [32, -10],

    [-40, -2],
    [-44, 2],
    [-16, -6],
    [6, 8],
    [18, 20],

    [-60, 40],
    [-20, 22],
    [11, 14],
    [40, -2],

    [-60, 60],
    [-10, 30],
    [10, 26],
    [30, 30]
]
var headshotsMatrix = [
  0, 1, 1, 1, 0, 0,
  0, 1, 1, 1, 0, 0,
  0, 1, 1, 1, 0,
  0, 1, 1, 0,
  0, 0, 1, 0
]
var headshots = [
  {
    img: '../img/headshots/David-by-Chris-Marxen-Headshots-Berlin.de.jpg',
    title: 'David Dias'
  },
  {
    img: '../img/headshots/Friedel-by-Chris-Marxen-Headshots-Berlin.de.jpg',
    title: 'Friedel Ziegelmayer'
  },
  {
    img: '../img/headshots/Hector-by-Chris-Marxen-Headshots-Berlin.de.jpg',
    title: 'Hector Sanjuan'
  },
  {
    img: '../img/headshots/Jeromy-by-Chris-Marxen-Headshots-Berlin.de.jpg',
    title: 'Jeromy Johnson'
  },
  {
    img: '../img/headshots/Jesse-by-Chris-Marxen-Headshots-Berlin.de.jpg',
    title: 'Jesse Clayburgh'
  },
  {
    img: '../img/headshots/Juan-by-Chris-Marxen-Headshots-Berlin.de.jpg',
    title: 'Juan Benet'
  },
  {
    img: '../img/headshots/Kuba-by-Chris-Marxen-Headshots-Berlin.de.jpg',
    title: 'Jakub Sztandera'
  },
  {
    img: '../img/headshots/Lars-by-Chris-Marxen-Headshots-Berlin.de.jpg',
    title: 'Lars Gierth'
  },
  {
    img: '../img/headshots/Matt-by-Chris-Marxen-Headshots-Berlin.de.jpg',
    title: 'Matt Zumwalt'
  },
  {
    img: '../img/headshots/Nicola-by-Chris-Marxen-Headshots-Berlin.de.jpg',
    title: 'Nicola Greco'
  },
  {
    img: '../img/headshots/Victor-by-Chris-Marxen-Headshots-Berlin.de.jpg',
    title: 'Victor Bjelkholm'
  }
]

$(document)
    .on('click touchstart', '.open-menu', function (event) {
      event.preventDefault()

      $(':root').addClass('is-opened')
      $('footer ~ nav a').focus()
    })
    .on('click touchstart', '.close-menu', function (event) {
      event.preventDefault()

      $(':root').removeClass('is-opened')
    })

    .on('screen-progress', '.about-main', function (event, data) {
      var bgProgress = bgProgressFn(data.progress)

      if (this.bgProgress !== bgProgress) {
        $('.header-background').css('opacity', bgProgress)
        this.bgProgress = bgProgress
      }

      var headerProgress = +clampedProgress(progressForValueInRange(this.offsetTop + this.offsetHeight, -data.scroll.y, data.scroll.wrapperHeight - data.scroll.y)).toFixed(4)
      if (this.headerProgress !== headerProgress) {
        var header = $('header')

        var nav = header.find('nav')
        nav.first().css('marginRight', transitionForProgressInRange(headerProgress, 14, 6) + '%')
        nav.last().css('marginLeft', transitionForProgressInRange(headerProgress, 14, 6) + '%')

        var logotypeProgress = headerProgress >= 0.4 ? 1 : 0// clampedProgress(progressForValueInRange(headerProgress, .05, .4));
        if (this.logotypeProgress !== logotypeProgress) {
          header.find('.logotype').css({
            opacity: 1 - logotypeProgress
          })
          this.logotypeProgress = logotypeProgress
        }

        this.headerProgress = headerProgress
      }

      var lineProgress = clampedProgress(progressForValueInRange(data.progress, 1, 1.5))
      if (this.lineProgress !== lineProgress) {
        var connector = $(this).find('.connector')
        var circle = connector.find('.circle')
        var line = connector.find('.line')

        circle.eq(0).css('transform', 'scale(' + clampedProgress(progressForValueInRange(lineProgress, 0, 0.02)) + ')')
        line.eq(0).css('transform', 'scaleY(' + clampedProgress(progressForValueInRange(lineProgress, 0.02, 0.06)) + ')')
        line.eq(1).css('transform', 'scaleX(' + clampedProgress(progressForValueInRange(lineProgress, 0.06, 0.6)) + ')')
        line.eq(2).css('transform', 'scaleY(' + clampedProgress(progressForValueInRange(lineProgress, 0.6, 0.98)) + ')')
        line.eq(2).find('span').css('transform', 'scaleY(' + (1 / clampedProgress(progressForValueInRange(lineProgress, 0.6, 0.98))) + ')')
        circle.eq(1).css('transform', 'scale(' + clampedProgress(progressForValueInRange(lineProgress, 0.98, 1)) + ')')

        this.lineProgress = lineProgress
      }
    })
    .on('screen-progress', '.about-mission', function (event, data) {
      var that = $(this)

        // var sceneProgress = +clampedProgress(progressForValueInRange(data.progress, .35, 1)).toFixed(2);
        // var frames = transitionForProgressInRange(sceneProgress, 0, 54);
        // if(this.framesLength !== frames) {
        //     var headerProgress = clampedProgress(progressForValueInRange(frames, 0, 30));
        //     that.find('h2').css({
        //         opacity: headerProgress.toFixed(2),
        //         transform: 'translateY(' + transitionForProgressInRange(headerProgress, 60, 0).toFixed(2) + 'px)'
        //     });
        //
        //     var paragraphProgress = clampedProgress(progressForValueInRange(frames, 2, 32));
        //     that.find('p').css({
        //         opacity: paragraphProgress.toFixed(2),
        //         transform: 'translateY(' + transitionForProgressInRange(paragraphProgress, 60, 0).toFixed(2) + 'px)'
        //     });
        //
        //     var composition = that.find('.composition');
        //
        //     var compositionProgress = frames >= 15 ? 1 : 0;//clampedProgress(progressForValueInRange(frames, 0, 30));
        //     composition.css('transform', 'translateX(' + transitionForProgressInRange(compositionProgress, 43.6, 0).toFixed(2) + '%)');
        //
        //     var hotspotData = [
        //         {
        //             startFrame: 12,
        //             x: 101.7,
        //             y: 179.1
        //         },
        //         {
        //             startFrame: 6,
        //             x: 74.8,
        //             y: 0
        //         },
        //         {
        //             startFrame: 0,
        //             x: 52.4,
        //             y: 64.8
        //         },
        //         {
        //             startFrame: 18,
        //             x: -107.1,
        //             y: -31.25
        //         },
        //         {
        //             startFrame: 23,
        //             x: -109.1,
        //             y: -48
        //         }
        //     ];
        //     composition.find('.hotspot').each(function(index) {
        //         var progress = frames >= 15 ? 1 : 0;//clampedProgress(progressForValueInRange(frames, hotspotData[index].startFrame, hotspotData[index].startFrame + 20));
        //
        //         $(this).css({
        //             opacity: transitionForProgressInRange(progress, 0, .05).toFixed(2),
        //             transform: 'translate(' + transitionForProgressInRange(progress, hotspotData[index].x, 0).toFixed(2) + '%, ' + transitionForProgressInRange(progress, hotspotData[index].y, 0).toFixed(2) + '%)'
        //         });
        //     });
        //
        //     var pictureProgress = frames >= 15 ? 1 : 0;//clampedProgress(progressForValueInRange(frames, 0, 30));
        //     composition.find('.picture').css('opacity', transitionForProgressInRange(pictureProgress, 0, 1).toFixed(2));
        //
        //     this.framesLength = frames;
        // }

      var bgProgress = bgProgressFn(data.progress)
      if (this.bgProgress !== bgProgress) {
        $('.mission-background').css('opacity', bgProgress)

        this.bgProgress = bgProgress
      }

      var lineProgress = clampedProgress(progressForValueInRange(data.progress, 1, 1.5))
      if (this.lineProgress !== lineProgress) {
        var connector = that.find('.connector')
        var circle = connector.find('.circle')
        var line = connector.find('.line')

        circle.eq(0).css('transform', 'scale(' + clampedProgress(progressForValueInRange(lineProgress, 0, 0.02)) + ')')
        line.eq(0).css('transform', 'scaleY(' + clampedProgress(progressForValueInRange(lineProgress, 0.02, 0.1)) + ')')
        line.eq(1).css('transform', 'scaleX(' + clampedProgress(progressForValueInRange(lineProgress, 0.1, 0.8)) + ')')
        line.eq(2).css('transform', 'scaleY(' + clampedProgress(progressForValueInRange(lineProgress, 0.8, 0.98)) + ')')
        circle.eq(1).css('transform', 'scale(' + clampedProgress(progressForValueInRange(lineProgress, 0.98, 1)) + ')')

        this.lineProgress = lineProgress
      }
    })
    .on('screen-progress', '.about-work', function (event, data) {
      var that = $(this)

        // var sceneProgress = +clampedProgress(progressForValueInRange(data.progress, .2, .6)).toFixed(2);
        // var frames = transitionForProgressInRange(sceneProgress, 0, 58);
        // if(this.sceneFrames !== frames) {
        //     var headerProgress = clampedProgress(progressForValueInRange(frames, 0, 30));
        //     that.find('h2').css({
        //         opacity: headerProgress.toFixed(2),
        //         transform: 'translateY(' + transitionForProgressInRange(headerProgress, 100, 0).toFixed(2) + 'px)'
        //     });
        //
        //     var paragraphProgress = clampedProgress(progressForValueInRange(frames, 2, 32));
        //     that.find('p').css({
        //         opacity: paragraphProgress.toFixed(2),
        //         transform: 'translateY(' + transitionForProgressInRange(paragraphProgress, 100, 0).toFixed(2) + 'px)'
        //     });
        //
        //     var slidesData = [4, 16, 28, 28];
        //     that.find('.composition').children().each(function(index) {
        //         var progress = frames >= 15 ? 1 : 0;//clampedProgress(progressForValueInRange(frames, slidesData[index], slidesData[index] + 30));
        //
        //         $(this).css({
        //             opacity: progress.toFixed(2),
        //             transform: 'translate(' + transitionForProgressInRange(progress, -13.1, 0).toFixed(2) + '%, ' + transitionForProgressInRange(progress, 11.7, 0).toFixed(2) + '%)'
        //         });
        //     });
        //
        //     this.sceneFrames = frames;
        // }

      var bgProgress = bgProgressFn(data.progress)
      if (this.bgProgress !== bgProgress) {
        $('.work-background').css('opacity', bgProgress)

        this.bgProgress = bgProgress
      }

      var lineProgress = clampedProgress(progressForValueInRange(data.progress, 1, 1.5))
      if (this.lineProgress !== lineProgress) {
        var connector = $(this).find('.connector')
        var circle = connector.find('.circle')
        var line = connector.find('.line')

        circle.eq(0).css('transform', 'scale(' + clampedProgress(progressForValueInRange(lineProgress, 0, 0.02)) + ')')
        line.eq(0).css('transform', 'scaleY(' + clampedProgress(progressForValueInRange(lineProgress, 0.02, 0.09)) + ')')
        line.eq(1).css('transform', 'scaleX(' + clampedProgress(progressForValueInRange(lineProgress, 0.09, 0.42)) + ')')
        line.eq(2).css('transform', 'scaleY(' + clampedProgress(progressForValueInRange(lineProgress, 0.42, 0.98)) + ')')
        circle.eq(1).css('transform', 'scale(' + clampedProgress(progressForValueInRange(lineProgress, 0.98, 1)) + ')')

        this.lineProgress = lineProgress
      }
    })
    .on('click', '.about-work .composition:not(.slided)', function (event) {
      event.preventDefault()
      trackClick('screenshot')

      var that = $(this)
      that.children().removeAttr('style')
        // myScroll.disable();

      setTimeout(function () {
        that.addClass('slided')
      }, 10)
    })
    .on('transitionend', '.about-work .composition.slided', function (event) {
      var that = $(this)

      clearTimeout(this.__transitionTimer)
      this.__transitionTimer = setTimeout(function () {
        that.removeClass('slided').append(that.children().eq(0))
            // myScroll.enable();
            // myScroll._execEvent('scroll');
      }, 50)
    })
    .on('screen-progress', '.about-open_source', function (event, data) {
      var that = $(this)

      data.progress = +clampedProgress(progressForValueInRange(data.progress, 0.35, 1)).toFixed(2)

      var frames = transitionForProgressInRange(data.progress, 0, 54)
      if (this.sceneFrames === frames) {
        return
      }
      this.sceneFrames = frames

        // var headerProgress = clampedProgress(progressForValueInRange(frames, 0, 30));
        // that.find('h2').css({
        //     opacity: headerProgress,
        //     transform: 'translateY(' + transitionForProgressInRange(headerProgress, 100, 0).toFixed(2) + 'px)'
        // });
        //
        // var paragraphProgress = clampedProgress(progressForValueInRange(frames, 2, 32));
        // that.find('p:not(:last-child)').css({
        //     opacity: paragraphProgress,
        //     transform: 'translateY(' + transitionForProgressInRange(paragraphProgress, 100, 0).toFixed(2) + 'px)'
        // });
        //
        // var likeProgress = clampedProgress(progressForValueInRange(frames, 4, 34));
        // that.find('p:last-child').css({
        //     opacity: likeProgress,
        //     transform: 'translateY(' + transitionForProgressInRange(likeProgress, 100, 0).toFixed(2) + 'px)'
        // });
        //
        // var composition = that.find('.composition');
        //
        // var compositionProgress = frames >= 15 ? 1 : 0;//clampedProgress(progressForValueInRange(frames, 0, 30));
        // composition.css('transform', 'translateX(' + transitionForProgressInRange(compositionProgress, -42.5, 0).toFixed(2) + '%)');
        //
        // var hotspotData = [
        //     {
        //         startFrame: 0,
        //         x: -325,
        //         y: 212.5
        //     },
        //     {
        //         startFrame: 6,
        //         x: -200,
        //         y: 95.24
        //     },
        //     {
        //         startFrame: 12,
        //         x: -271.2,
        //         y: -167.65
        //     },
        //     {
        //         startFrame: 18,
        //         x: -157.9,
        //         y: -172.4
        //     },
        //     {
        //         startFrame: 0,
        //         x: 185,
        //         y: -96.72
        //     },
        //     {
        //         startFrame: 8,
        //         x: 81.9,
        //         y: -68.84
        //     }
        // ];
        // composition.find('.hotspot').each(function(index) {
        //     var progress = frames >= 15 ? 1 : 0;//clampedProgress(progressForValueInRange(frames, hotspotData[index].startFrame, hotspotData[index].startFrame + 20));
        //
        //     $(this).css({
        //         opacity: transitionForProgressInRange(progress, 0, .05).toFixed(2),
        //         transform: 'translate(' + transitionForProgressInRange(progress, hotspotData[index].x, 0).toFixed(2) + '%, ' + transitionForProgressInRange(progress, hotspotData[index].y, 0).toFixed(2) + '%)'
        //     });
        // });
        //
        // var pictureProgress = frames >= 15 ? 1 : 0;//clampedProgress(progressForValueInRange(frames, 0, 30));
        // composition.find('.picture').css('opacity', transitionForProgressInRange(pictureProgress, 0, 1).toFixed(2));
    })

    .on('screen-progress', '.legal-block, .join-block, .media-block', function (event, data) {
      var bgProgress = bgProgressFn(data.progress, true)
      if (this.bgProgress !== bgProgress) {
        $('.legal-background').css('opacity', bgProgress)
        this.bgProgress = bgProgress
      }
    })

    .on('screen-progress', '.projects-section', function (event, data) {
      var bgProgress = bgProgressFn(data.progress)
      if (this.bgProgress !== bgProgress) {
        (this._background = this._background || $($(this).data('bg-selector'))).css('opacity', transitionForProgressInRange(bgProgress, 0, 0.2))
        this.bgProgress = bgProgress
      }

      var sceneProgress = +clampedProgress(progressForValueInRange(data.progress, 0.35, 0.5)).toFixed(2)
      if (this.sceneProgress !== sceneProgress) {
        var figure = $(this).find('figure')

        figure.find('> img').css({
          opacity: sceneProgress.toFixed(2),
          transform: 'translateX(' + transitionForProgressInRange(sceneProgress, -200, 0).toFixed(2) + 'px)'
        })
        figure.find('> figcaption').css({
          opacity: sceneProgress.toFixed(2),
          transform: 'translateX(' + transitionForProgressInRange(sceneProgress, 200, 0).toFixed(2) + 'px)'
        })

        this.sceneProgress = sceneProgress
      }
    })

    .on('click', '.slide-list .tabs .tab', function (event) {
      event.preventDefault()

      $(this).parents('.slide-list').eq(0).find('.tabs-content').eq(0).find('li').removeClass('is-current').eq($(this).parents('.tabs').eq(0).find('li').removeClass('is-current').index($(this).closest('li').addClass('is-current'))).addClass('is-current')
    })

    .on('screen-progress', '.join-main-block', function (event, data) {
      var bgProgress = bgProgressFn(data.progress)
      if (this.bgProgress !== bgProgress) {
        (this._background = this._background || $('.join-main-background')).css('opacity', bgProgress)
        this.bgProgress = bgProgress
      }
    })
    .on('screen-progress', '.join-blue-block', function (event, data) {
      var bgProgress = bgProgressFn(data.progress)
      if (this.bgProgress !== bgProgress) {
        (this._background = this._background || $('.join-blue-honeycomb-background')).css('opacity', bgProgress)
        this.bgProgress = bgProgress
      }
    })
    .on('screen-progress', '.join-pink-block', function (event, data) {
        // var sceneProgress = +clampedProgress(progressForValueInRange(data.progress, .6, .9)).toFixed(2);
        // var items = $(this).find('.map-lines li');
        // var frames = transitionForProgressInRange(sceneProgress, 0, items.length * 2 + 7);
        // if(this.framesLength !== frames) {
        //     var item;
        //     var line;
        //     var span;
        //     var lineHeight;
        //     var lineWidth;
        //
        //     for(var i = 0; i < items.length; i++) {
        //         item = items.eq(i);
        //
        //         item.find('.pin').css('opacity', clampedProgress(progressForValueInRange(frames, i * 2, i * 2 + 2)));
        //
        //         line = item.find('.line');
        //         span = line.find('span');
        //         lineHeight = line.height();
        //         lineWidth = line.width();
        //         span.eq(0).css('transform', 'scaleY(' + clampedProgress(progressForValueInRange(frames, i * 2 + 2, i * 2 + 2 + lineHeight / (lineHeight + lineWidth) * 5)) + ')');
        //         span.eq(1).css('transform', 'scaleX(' + clampedProgress(progressForValueInRange(frames, i * 2 + 2 + lineHeight / (lineHeight + lineWidth) * 5, i * 2 + 7)) + ')');
        //
        //         item.find('.text').css('opacity', clampedProgress(progressForValueInRange(frames, i * 2 + 7, i * 2 + 9)));
        //     }
        //
        //     this.framesLength = frames;
        // }
      if (data.progress >= 0.8) {
        $(this).find('.map-lines').addClass('is-complete')
      }

      var bgProgress = bgProgressFn(data.progress)
      if (this.bgProgress !== bgProgress) {
        (this._background = this._background || $('.join-pink-background')).css('opacity', bgProgress)
        this.bgProgress = bgProgress
      }
    })
    .on('screen-progress', '.join-slider-block', function (event, data) {
      var bgProgress = bgProgressFn(data.progress)
      if (this.bgProgress !== bgProgress) {
        (this._background = this._background || $('.join-blue-background')).css('opacity', bgProgress)
        this.bgProgress = bgProgress
      }
    })
    .on('screen-progress', '.join-text-hexagon-block', function (event, data) {
      var bgProgress = bgProgressFn(data.progress)
      if (this.bgProgress !== bgProgress) {
        (this._background = this._background || $('.join-pink-background')).css('opacity', bgProgress)
        this.bgProgress = bgProgress
      }
    })

    .on('screen-progress', '.media-block', function (event, data) {
      var bgProgress = bgProgressFn(data.progress, true)
      if (this.bgProgress !== bgProgress) {
        (this._background = this._background || $('.team-pink-background')).css('opacity', bgProgress)
        this.bgProgress = bgProgress
      }
    })

    .on('screen-progress', '.headshots-block', function (event, data) {
      var bgProgress = bgProgressFn(data.progress)
      if (this.bgProgress !== bgProgress) {
        (this._background = this._background || $('.team-pink-background')).css('opacity', bgProgress)
        this.bgProgress = bgProgress
      }

      var sceneProgress = data.progress >= 0.6 ? 1 : 0// +clampedProgress(progressForValueInRange(data.progress, .35, 1)).toFixed(2);
      if (this.sceneProgress !== sceneProgress) {
        var investors = $(this).find('.headshots')
        var investor = investors.find('.headshot')

        headshotsShift.forEach(function (shift, index) {
          investor.eq(index).css({
            opacity: sceneProgress,
            transform: 'translate(' + transitionForProgressInRange(sceneProgress, shift[0], 0) + '%, ' + transitionForProgressInRange(sceneProgress, shift[1], 0) + '%)'
          })
        })

        this.sceneProgress = sceneProgress
      }
    })
    .on('screen-progress', '.investors-block', function (event, data) {
      var headerProgress = clampedProgress(progressForValueInRange(data.progress, 0.415, 0.6))
      if (this.headerProgress !== headerProgress) {
        var span = $(this).find('.bordered-header span')
        span.eq(0).css('opacity', clampedProgress(progressForValueInRange(headerProgress, 0, 0.4)))
        span.eq(1).css('transform', 'scaleX(' + clampedProgress(progressForValueInRange(headerProgress, 0, 0.19)) + ')')
        span.eq(2).css('transform', 'scaleY(' + clampedProgress(progressForValueInRange(headerProgress, 0.19, 0.3)) + ')')
        span.eq(3).css('transform', 'scaleX(' + clampedProgress(progressForValueInRange(headerProgress, 0.3, 0.69)) + ')')
        span.eq(4).css('transform', 'scaleY(' + clampedProgress(progressForValueInRange(headerProgress, 0.69, 0.8)) + ')')
        span.eq(5).css('transform', 'scaleX(' + clampedProgress(progressForValueInRange(headerProgress, 0.8, 1)) + ')')
        this.headerProgress = headerProgress
      }
      var sceneProgress = data.progress >= 0.7 ? 1 : 0// +clampedProgress(progressForValueInRange(data.progress, .35, 1)).toFixed(2);
      if (this.sceneProgress !== sceneProgress) {
        var investors = $(this).find('.investors')
        var investor = investors.find('.investor')

        investors.find('span').eq(0).css('opacity', sceneProgress);

        [
                 [7, -37],
                 [19, -44],

                 [-52, -31],
                 [-16, -52],
                 [14, -44],
                 [33, -60],
                 [76, -53],

                 [-37, -19],
                 [-44, 20],
                 [-22, 31],
                 [15, -19],
                 [32, 20],
                 [41, -17],

                 [-44, 64],
                 [-11, 75],
                 [-10, 73],
                 [3, 67],
                 [61, 58],

                 [11, 55],
                 [11, 34]
        ].forEach(function (shift, index) {
          investor.eq(index).css({
            opacity: sceneProgress,
            transform: 'translate(' + transitionForProgressInRange(sceneProgress, shift[0], 0) + '%, ' + transitionForProgressInRange(sceneProgress, shift[1], 0) + '%)'
          })
        })

        this.sceneProgress = sceneProgress
      }
    })

var screens
$(function () {
  $(':root').addClass('is-ready')

  screens = $('section').toArray().map(function (screen) {
    return $(screen)
  })
    // myScroll._execEvent('scroll');
})
$(window).resize(function () {
    // myScroll._execEvent('scroll');
})

var lastRenderTime
function recalculateScreens () {
  var renderTime = new Date()

    // console.log(this);

  if (!screens || !screens.length || lastRenderTime && (renderTime - lastRenderTime) < (1000 / 60)) {
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
$(function () {
  $(window).scroll()
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
function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}

var investors = [
  {
    img: '../img/investors/ycombinator.jpg',
    caption: 'ycombinator'
  },
  {
    img: '../img/investors/Naval_Ravikant.jpg',
    caption: 'Naval Ravikant'
  },
  {
    img: '../img/investors/Semil_Shah.jpg',
    caption: 'Semil Shah'
  },
  {
    img: '../img/investors/Fred_Ehrsam.jpg',
    caption: 'Fred Ehrsam'
  },
  {
    img: '../img/investors/StartX.jpg',
    caption: 'StartX'
  },
  {
    img: '../img/investors/Digital_Currency_Group.jpg',
    caption: 'Digital Currency Group'
  },
  {
    img: '../img/investors/BlueYard.jpg',
    caption: 'BlueYard'
  },
  {
    img: '../img/investors/Stanford_University.jpg',
    caption: 'Stanford University'
  },
  {
    img: '../img/investors/Winklevoss_Capital.jpg',
    caption: 'Winklevoss Capital'
  },
  {
    img: '../img/investors/Dylan_Field.jpg',
    caption: 'Dylan Field'
  },
  {
    img: '../img/investors/FundersClub.jpg',
    caption: 'FundersClub'
  },
  {
    img: '../img/investors/Vinodan_Lingam.jpg',
    caption: 'Vinodan Lingam'
  },
  {
    img: '../img/investors/Jaan_Tallinn.jpg',
    caption: 'Jaan Tallinn'
  },
  {
    img: '../img/investors/USV.jpg',
    caption: 'USV'
  }
]

$('.headshots').each(function () {
  var node = $('<figure class="headshot fragment"><div class="hexagon-form"></div><figcaption><div class="hexagon-border-form"></div><span></span><div class="hexagon-form"></div></figcaption><span></span></figure>')

  var shots = shuffle(headshots)

  shots.splice(getRandomInt(0, shots.length - 1), 0, {
    img: '../img/headshots/Skylar-by-Chris-Marxen-Headshots-Berlin.de.jpg',
    title: 'Skylar Norris'
  })

  shots = shots.map(function (shot) {
    var img = new Image()
    img.src = shot.img
    img.className = 'hexagon-form'
    shot.img = img
    return shot
  })

  headshotsMatrix.forEach(function (flag) {
    var item = node.clone()

    if (flag) {
      var shot = shots.shift()
      item.find('> div').append(shot.img)
      item.find('figcaption span').text(shot.title)
    }

    this.append(item)
  }, $(this).empty())
})

$('.investors').each(function () {
  var node = $('<figure class="investor fragment"><figcaption><div class="hexagon-form"></div><span></span><div class="hexagon-form"></div></figcaption><span class="hexagon-form"></span></figure>')

  shuffle(investors).forEach(function (item) {
    var img = new Image()
    img.src = item.img
    img.className = 'hexagon-form'

    var itemNode = node.clone()
    itemNode.prepend(img)
    itemNode.find('figcaption span').text(item.caption)

    this.append(itemNode)
  }, $(this).empty().append('<span class="fragment"/>'))
})

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

    //  logo
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

$('.media-content').eq(0).each(function () {
  var node = $(this)

  $.get('../media-content.json', function (content) {
    const mediaContent = JSON.parse(content)
    mediaContent.forEach(function (item, index, list) {
      node.append(
            '<li data-category="' + item.category + '" class="' + (index === list.length - 1 ? 'is-last' : '') + '">' +
                '<figure class="picture"><img alt class="hexagon-form" src="' + item.image_url + '"><figcaption class="hexagon-border-form"></figcaption></figure>' +
                '<div class="media-content-inner">' +
                    '<span>' + item.date + '</span>' +
                    '<h2><a href="' + item.article_url + '" target="_blank">' + item.title + '</a></h2>' +
                    '<p>' + item.preview + '</p>' +
                '</div>' +
            '</li>'
            )
    })

    var categories = mediaContent
            .map(function (item) {
              return item.category
            })
            .filter(function (item, index, list) {
              return list.indexOf(item) === index
            })
            .sort(function (a, b) {
              return a > b ? 1 : a < b ? -1 : 0
            })

    node.siblings('.filter').each(function () {
      categories.forEach(function (category) {
        this.append('<li><a>' + category + '</a></li>')
      }, $(this))
    })
  })
})
$(document).on('click', '.media-block .filter li a', function (event) {
  event.preventDefault()

  $('.media-block .filter li').removeClass('is-selected').find(this).parents('li').eq(0).addClass('is-selected')

  var category = $(this).text()
  trackClick('MediaSelector_' + category)
  var all = $('.media-content [data-category]').removeClass('is-last').toArray()
  var showed = all.filter(function (node) {
    return category === 'all' || category === $(node).data('category')
  })

  $().add(all).not(showed).slideUp(500)
  $().add(showed).slideDown(500).last().addClass('is-last')
})

$('.join-slider-block')
    .on('touchstart', function (event) {
      this.__startX = event.touches[0].clientX
      this.__startY = event.touches[0].clientY
    })
    .on('touchmove', function (event) {
      this.__endX = event.touches[0].clientX
      this.__endY = event.touches[0].clientY
    })
    .on('touchend', function () {
      if (this.__endX == null || this.__endY == null) {
        return
      }

      var deltaX = this.__endX - this.__startX
      var deltaY = this.__endY - this.__startY

      if (Math.abs(deltaX) < Math.abs(deltaY)) {
        return
      }

      var tabs = $(this).find('.slide-list .tabs .tab')
      var last = tabs.length - 1
      var current = tabs.index(tabs.filter('.is-current'))

      if (deltaX < 0) {
        tabs.eq(current === last ? 0 : current + 1).click()
      }
      if (deltaX > 0) {
        tabs.eq(current ? current - 1 : last).click()
      }

      this.__startX = this.__endX = this.__startY = this.__endY = null
    })

$('.legal-block')
    .on('click', '.filter a', function (event) {
      $(this).closest('li').addClass('is-selected').siblings('li').removeClass('is-selected')
      $(this.hash).filter('.content-block').addClass('is-selected').siblings('.content-block').removeClass('is-selected')

      var scrollTop = $('html').scrollTop() || $('body').scrollTop()
      location.hash = this.hash
      $('html, body').scrollTop(scrollTop)

      event.preventDefault()
    })
    .each(function () {
      if (!location.hash) {
        return
      }

      $(this).find('.filter a').each(function () {
        if (this.hash === location.hash) {
          $(this).click()
          setTimeout(function () {
            $('html, body').scrollTop(0)
          }, 50)
        }
      })
    })
$(document).on('click', '.legal-go', function (event) {
  var legalBlock = $('.legal-block')

  if (!legalBlock.length) {
    return
  }

    // event.preventDefault();

  var hash = this.hash

  legalBlock.find('.filter a').each(function () {
    if (this.hash === hash) {
      $(this).click()
      scrollToElement('body')
    }
  })
})

$(':root').addClass(('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch || navigator.maxTouchPoints > 0 || window.navigator.msMaxTouchPoints > 0) ? 'is-touch' : 'no-touch')
