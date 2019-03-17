import * as support from './support'

import swal from 'sweetalert'
import newGame from './main'

export function showNumber(i, j, number) {
	const numberCell = $(`#number-cell-${i}-${j}`)

	numberCell.css({
		'background-color': support.getNumberBackgroundColor(number),
		color: support.getNumberColor(number)
	})

	numberCell.text(number)

	numberCell.animate(
		{
			width: support.cellSideLength,
			height: support.cellSideLength,
			top: support.getPosTop(i),
			left: support.getPosLeft(j)
		},
		100
	)
}

export function showMove(fromx, fromy, tox, toy) {
	const numberCell = $(`#number-cell-${fromx}-${fromy}`)
	numberCell.animate(
		{
			top: support.getPosTop(tox),
			left: support.getPosLeft(toy)
		},
		200
	)
}

function setCounter(count, selector) {
	let $digital = $(`${selector} span`)

	for (let i = $digital.length - 1; i >= 0; i--) {
		let val = parseInt(count / Math.pow(10, i), 10)
		count = count % Math.pow(10, i)
		$digital.eq($digital.length - 1 - i).attr('class', `n${val % 10}`)
	}
}
export function updateScore(score) {
	if (score === 0) {
		updateMaxScore(maxScore)
	}
	setCounter(+score, '#score')
	if (score > maxScore) {
		updateMaxScore(score)
	}
}
export function updateMaxScore(score) {
	setCounter(+score, '#maxscore')
}

export function showGameover(isNewMaxScore) {
	const content = isNewMaxScore
		? lang.gameOver.newMaxScoreTip
		: lang.gameOver.failToNewMaxScoreTip

	swal({
		title: 'Game Over.',
		text: content,
		icon: 'success',
		buttons: lang.gameOver.buttons,
		dangerMode: true
	}).then(willReStart => {
		if (willReStart) {
			newGame()
		}
	})
}

const fadeEls = [...document.querySelectorAll('.fade')]

window.addEventListener('load', function () {
	fadeEls.forEach(e => e.classList.add('in'))
	if (!localStorage.getItem('hadPlay')) {
		swal({
			type: 'info',
			title: lang.introduce.title,
			text: lang.introduce.content
		})
		localStorage.setItem('hadPlay', true)
	}
})

window.addEventListener('beforeunload', function () {
	fadeEls.forEach(e => e.classList.remove('in'))
})
