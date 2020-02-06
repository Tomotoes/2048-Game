window.board = []
window.hasConflicted = []

Object.defineProperty(window, 'score', {
	_score: 0,
	get() {
		return this._score
	},
	set(value) {
		this._score = value
		animation.updateScore(value)
	}
})

Object.defineProperty(window, 'maxScore', {
	_maxScore: 0,
	get() {
		return this._maxScore
	},
	set(value) {
		this._maxScore = value
		animation.updateMaxScore(value)
	}
})

window.minScore = Number.parseInt(localStorage.getItem('minScore'))

import * as support from './support'

import * as animation from './animation'

window.maxValue = 0

function updateBoardView() {
	$('.number-cell').remove()

	for (let i = 0; i < 4; ++i) {
		for (let j = 0; j < 4; ++j) {
			$(`#grid-cell-${i}-${j}`).after(
				`<div class=number-cell id=number-cell-${i}-${j}></div>`
			)

			const numberCell = $(`#number-cell-${i}-${j}`)

			if (board[i][j] === 0) {
				numberCell.css({
					width: '0px',
					height: '0px',
					top: support.getPosTop(i) + support.cellSideLength / 2,
					left: support.getPosLeft(j) + support.cellSideLength / 2
				})
			} else {
				numberCell.css({
					width: support.cellSideLength,
					height: support.cellSideLength,
					top: support.getPosTop(i),
					left: support.getPosLeft(j),
					'background-color': support.getNumberBackgroundColor(board[i][j]),
					color: support.getNumberColor(board[i][j])
				})

				numberCell.text(board[i][j])
				maxValue = Math.max(maxValue, board[i][j])
			}
			hasConflicted[i][j] = false
		}
	}
	$('.number-cell').css({
		'line-height': `${support.cellSideLength}px`,
		'font-size': `${0.4 * support.cellSideLength}px`
	})
}
export default function newGame(playNew) {
	support.prepareForMobile()

	/* 初始化棋盘格 */
	Init(playNew)

	if (playNew) {
		generateOneNumver()
		generateOneNumver()
	}
}
function Init(playNew) {
	for (let i = 0; i < 4; ++i) {
		for (let j = 0; j < 4; ++j) {
			const gridCell = $(`#grid-cell-${i}-${j}`)

			gridCell.css({
				top: support.getPosTop(i),
				left: support.getPosLeft(j)
			})
		}
	}
	if (!localStorage.getItem('score') || playNew) {
		for (let i = 0; i < 4; ++i) {
			board[i] = []
			hasConflicted[i] = []
			for (let j = 0; j < 4; ++j) {
				board[i][j] = 0
				hasConflicted[i][j] = false
			}
		}
		score = 0
		maxScore = maxScore ? maxScore : 0
		maxValue = 0
	} else {
		board = JSON.parse(localStorage.getItem('board')) || []
		score = Number.parseInt(localStorage.getItem('score')) || 0
		maxScore = Number.parseInt(localStorage.getItem('maxScore')) || 0
		hasConflicted = JSON.parse(localStorage.getItem('hasConflicted')) || []
		maxValue = Number.parseInt(localStorage.getItem('maxValue')) || 0
	}

	updateBoardView()
}

function generateRandomNumber() {
	return maxValue < 512
		? Math.random() < 0.5
			? 2
			: Math.random() > 0.85
			? 8
			: 4
		: Math.random() < 0.2
		? 2
		: Math.random() > 0.6
		? 4
		: 8
}

function generateOneNumver() {
	if (support.noSpace(board)) {
		return false
	}
	const emptyCells = []
	for (let i = 0; i < 4; ++i) {
		for (let j = 0; j < 4; ++j) {
			if (board[i][j] === 0) {
				emptyCells.push({ x: i, y: j })
			}
		}
	}
	if (emptyCells.length === 0) {
		return false
	}

	const { x: randomX, y: randomY } = emptyCells[
		Math.floor(Math.random() * emptyCells.length)
	]

	const randomNumber = generateRandomNumber()

	board[randomX][randomY] = randomNumber

	animation.showNumber(randomX, randomY, randomNumber)

	return true
}

function isGameover() {
	if (support.noSpace(board) && support.noMove(board)) {
		const isNewMinScore = minScore ? minScore > score : false
		const isNewMaxScore = score > maxScore

		setTimeout(() => animation.showGameover(isNewMaxScore, isNewMinScore), 500)

		if (!minScore || isNewMinScore) {
			localStorage.setItem('minScore', score)
			minScore = score
		}

		if (isNewMaxScore) {
			maxScore = score
			localStorage.setItem('maxScore', score)
		}
	}
}

function moveLeft() {
	if (!support.canMoveLeft(board)) {
		return false
	}
	for (let i = 0; i < 4; ++i) {
		for (let j = 0; j < 4; ++j) {
			if (board[i][j] !== 0) {
				for (let k = 0; k < j; ++k) {
					if (support.noBlockHorizontal(i, k, j, board)) {
						if (board[i][k] === 0) {
							animation.showMove(i, j, i, k)
							board[i][k] = board[i][j]
							board[i][j] = 0
						} else if (board[i][k] === board[i][j] && !hasConflicted[i][k]) {
							animation.showMove(i, j, i, k, true)
							board[i][k] += board[i][j]
							board[i][j] = 0

							score += board[i][k]

							hasConflicted[i][k] = true
						}
					}
				}
			}
		}
	}
	setTimeout(() => updateBoardView(), 200)
	return true
}

function moveRight() {
	if (!support.canMoveRight(board)) {
		return false
	}
	for (let i = 0; i < 4; ++i) {
		for (let j = 2; j >= 0; --j) {
			if (board[i][j] !== 0) {
				for (let k = 3; k > j; --k) {
					if (support.noBlockHorizontal(i, j, k, board)) {
						if (board[i][k] === 0) {
							animation.showMove(i, j, i, k)
							board[i][k] = board[i][j]
							board[i][j] = 0
						} else if (board[i][k] === board[i][j] && !hasConflicted[i][k]) {
							animation.showMove(i, j, i, k, true)
							board[i][k] += board[i][j]
							board[i][j] = 0

							score += board[i][k]
							hasConflicted[i][k] = true
						}
					}
				}
			}
		}
	}
	setTimeout(() => updateBoardView(), 200)
	return true
}

function moveUp() {
	if (!support.canMoveUp(board)) {
		return false
	}
	for (let j = 0; j < 4; ++j) {
		for (let i = 1; i < 4; ++i) {
			if (board[i][j] !== 0) {
				for (let k = 0; k < i; ++k) {
					if (support.noBlockVertical(j, k, i, board)) {
						if (board[k][j] === 0) {
							animation.showMove(i, j, k, j)
							board[k][j] = board[i][j]
							board[i][j] = 0
						} else if (board[k][j] === board[i][j] && !hasConflicted[k][j]) {
							animation.showMove(i, j, k, j, true)
							board[k][j] += board[i][j]
							board[i][j] = 0

							score += board[k][j]
							hasConflicted[k][j] = true
						}
					}
				}
			}
		}
	}
	setTimeout(() => updateBoardView(), 200)
	return true
}

function moveDown() {
	if (!support.canMoveDown(board)) {
		return false
	}
	for (let j = 0; j < 4; ++j) {
		for (let i = 2; i >= 0; --i) {
			if (board[i][j] !== 0) {
				for (let k = 3; k > i; --k) {
					if (support.noBlockVertical(j, i, k, board)) {
						if (board[k][j] === 0) {
							animation.showMove(i, j, k, j)
							board[k][j] = board[i][j]
							board[i][j] = 0
						} else if (board[k][j] === board[i][j] && !hasConflicted[k][j]) {
							animation.showMove(i, j, k, j, true)
							board[k][j] += board[i][j]
							board[i][j] = 0

							score += board[k][j]
							hasConflicted[k][j] = true
						}
					}
				}
			}
		}
	}
	setTimeout(() => updateBoardView(), 200)
	return true
}

const keys = { '37': moveLeft, '87': moveUp, '68': moveRight, '83': moveDown, '65': moveLeft, '38': moveUp, '39': moveRight, '40': moveDown }

$(document).on('keydown', e => {
	if (Object.keys(keys).some(el => el == e.keyCode)) {
		if (keys[e.keyCode]()) {
			e.preventDefault()

			setTimeout(() => generateOneNumver(), 210)
			setTimeout(() => isGameover(), 300)
		}
	}
})

$('#newGameBtn').on('click', newGame.bind(true))

let startX = 0
let startY = 0
let endX = 0
let endY = 0

document.addEventListener('touchstart', e => {
	startX = e.touches[0].pageX
	startY = e.touches[0].pageY
})

document.addEventListener('touchend', e => {
	endX = e.changedTouches[0].pageX
	endY = e.changedTouches[0].pageY

	const deltaX = endX - startX
	const deltaY = endY - startY

	const absX = Math.abs(deltaX)
	const absY = Math.abs(deltaY)

	const clickWidth = support.documentWidth * 0.3

	/* 判断是否点击事件 */
	if (absX < clickWidth && absY < clickWidth) {
		return
	}

	if (
		absX > absY
			? deltaX > 0
				? moveRight()
				: moveLeft()
			: deltaY > 0
			? moveDown()
			: moveUp()
	) {
		e.preventDefault()
		setTimeout(() => generateOneNumver(), 210)
		setTimeout(() => isGameover(), 300)
	}
})

document.addEventListener('touchmove', e => {
	e.preventDefault()
})
