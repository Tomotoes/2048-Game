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
			left: support.getPosLeft(j),
			opacity: 1
		},
		150
	)
}

export function showMove(fromX, fromY, toX, toY, canMerge) {
	const numberCell = $(`#number-cell-${fromX}-${fromY}`)
	const animate = {
		top: support.getPosTop(toX),
		left: support.getPosLeft(toY)
	}
	const gridCell = $(`#grid-cell-${toX}-${toY}`)
	if (canMerge) {
		gridCell.addClass('cell-merged')
	}
	numberCell.animate(animate, 180, () => {
		if (canMerge) {
			gridCell.removeClass('cell-merged')
		}
	})
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
	setCounter(+score, '#score')
	if (score > maxScore) {
		updateMaxScore(score)
	}
}
export function updateMaxScore(score) {
	setCounter(+score, '#maxscore')
}

export function showGameover(isNewMaxScore, isNewMinScore) {
	const content = isNewMaxScore
		? lang.gameOver.newMaxScoreTip
		: isNewMinScore
		? lang.gameOver.newMinScoreTip
		: lang.gameOver.failToNewMaxScoreTip

	swal({
		title: 'Game Over.',
		text: content,
		icon: 'success',
		buttons: lang.gameOver.buttons,
		dangerMode: true
	}).then(willReStart => {
		if (willReStart) {
			newGame(true)
		}
	})
}