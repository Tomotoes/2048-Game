import * as support from './support'

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

export function updateScore(score) {
	$('#score').text(score)
}
export function updateMaxScore(score) {
	$('#maxscore').text(score)
}

export function showGameover(content) {
	$('#grid-container').hide(1000)
	$('p').after(`<div id="gameover"><h1>${content}</h1></div>`)

	setTimeout(function() {
		$('#gameover').animate(
			{
				opacity: '1'
			},
			1000
		)
	}, 0)
}
