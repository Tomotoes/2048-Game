import 'css/style'

import newGame from './main'

newGame()

const fadeEls = [...document.querySelectorAll('.fade')]
window.addEventListener('load', function () {
	fadeEls.forEach(e => e.classList.add('in'))
})

window.addEventListener('beforeunload', function() {
	fadeEls.forEach(e => e.classList.remove('in'))
})
