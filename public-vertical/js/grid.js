/* global $, hexGrid, contributors */

function shuffle (array) {
  var currentIndex = array.length
  var temporaryValue
  var randomIndex

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    // And swap it with the current element.
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

var shuffled = shuffle(contributors)
console.log('Total:', shuffled.length)

shuffled.forEach(function (val) {
  var img = $('<img />', {
    'class': 'hex',
    'src': val.photo,
    'alt': val.username
  })

  var anchor = $('<a />', {
    'href': val.url,
    'target': '_blank'
  })

  anchor.append(img).appendTo('#grid')
})

function scan () {
  var hexes = document.querySelectorAll('.hex')
  var root = document.querySelector('#grid')

  hexGrid({ element: root, spacing: 4 }, hexes)
}

scan()
window.addEventListener('resize', scan)
window.addEventListener('load', scan)
