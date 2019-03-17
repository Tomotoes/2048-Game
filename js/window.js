const fadeEls = [...document.querySelectorAll('.fade')]
function openWindow() {
	fadeEls.forEach(e => e.classList.add('in'))
	if (!localStorage.getItem('hadPlay')) {
		swal({
			icon: 'info',
			title: lang.introduce.title,
			text: lang.introduce.content
		})
		localStorage.setItem('hadPlay', true)
	}
}
window.addEventListener('load', openWindow)

function closeWindow() {
	localStorage.setItem('board', JSON.stringify(board))
	localStorage.setItem('hasConflicted', JSON.stringify(hasConflicted))
	localStorage.setItem('score', score)
	localStorage.setItem('maxValue', maxValue)
	if (maxScore < score) {
		localStorage.setItem('maxScore', score)
	}
	fadeEls.forEach(e => e.classList.remove('in'))
}

window.addEventListener('beforeunload', closeWindow)
