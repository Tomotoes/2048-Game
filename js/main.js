const board = new Array()
const hasConflicted = new Array()
let score = 0

import * as support from './support'

import * as animation from './animation'

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
			}
			hasConflicted[i][j] = false
		}
	}
	$('.number-cell').css({
		'line-height': `${support.cellSideLength}px`,
		'font-size': `${0.4 * support.cellSideLength}px`
	})
}

function Init() {
	for (let i = 0; i < 4; ++i) {
		board[i] = new Array()
		hasConflicted[i] = new Array()
		for (let j = 0; j < 4; ++j) {
			board[i][j] = 0
			hasConflicted[i][j] = false

			const gridCell = $(`#grid-cell-${i}-${j}`)

			gridCell.css({
				top: support.getPosTop(i),
				left: support.getPosLeft(j)
			})
		}
	}

	updateBoardView()

	score = 0
	animation.updateScore(score)
	const maxScore = localStorage.getItem('maxScore') || 0
	$('#maxscore').text(maxScore)
}

function generateOneNumver() {
	if (support.noSpace(board)) {
		return false
	}

	/* 随机一个位置 */
	let randomX = parseInt(Math.floor(Math.random() * 4))
	let randomY = parseInt(Math.floor(Math.random() * 4))
	let failTimes = 0
	while (failTimes < 50) {
		if (board[randomX][randomY] === 0) {
			break
		}
		randomX = parseInt(Math.floor(Math.random() * 4))
		randomY = parseInt(Math.floor(Math.random() * 4))
		failTimes++
	}
	if (failTimes === 50) {
		for (let i = 0; i < 4; ++i) {
			for (let j = 0; j < 4; ++j) {
				if (board[i][j] === 0) {
					randomX = i
					randomY = j
				}
			}
		}
	}

	/* 随机一个数字 */
	const randomNumber = Math.random() < 0.5 ? 2 : 4

	/* 在随机位置显示随机数字 */
	board[randomX][randomY] = randomNumber

	animation.showNumber(randomX, randomY, randomNumber)

	return true
}
let noGameover = false

function isGameover() {
	if (support.noSpace(board) && support.noMove(board) && !noGameover) {
		noGameover = true

		const maxScore = localStorage.getItem('maxScore')
		if (maxScore < score || !maxScore) {
			localStorage.setItem('maxScore', score)
			animation.updateMaxScore(localStorage.getItem('maxScore'))
			setTimeout(() => animation.showGameover('你创造了历史！'), 500)
		} else {
			setTimeout(() => animation.showGameover('笨蛋啊~'), 500)
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
							animation.showMove(i, j, i, k)
							board[i][k] += board[i][j]
							board[i][j] = 0

							score += board[i][k]
							animation.updateScore(score)

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
							animation.showMove(i, j, i, k)
							board[i][k] += board[i][j]
							board[i][j] = 0

							score += board[i][k]
							animation.updateScore(score)
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
							animation.showMove(i, j, k, j)
							board[k][j] += board[i][j]
							board[i][j] = 0

							score += board[k][j]
							animation.updateScore(score)
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
							animation.showMove(i, j, k, j)
							board[k][j] += board[i][j]
							board[i][j] = 0

							score += board[k][j]
							animation.updateScore(score)
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
export default function newGame() {
	support.prepareForMobile()

	/* 初始化棋盘格 */
	Init()

	/* 在随机两个格子生成数字 */
	generateOneNumver()
	generateOneNumver()
}

$(document).on('keydown', e => {
	if (e.keyCode === 37 || e.keyCode === 65) {
		if (moveLeft()) {
			e.preventDefault()

			setTimeout(() => generateOneNumver(), 210)
			setTimeout(() => isGameover(), 300)
		}
	} else if (e.keyCode === 38 || e.keyCode === 87) {
		if (moveUp()) {
			e.preventDefault()

			setTimeout(() => generateOneNumver(), 210)
			setTimeout(() => isGameover(), 300)
		}
	} else if (e.keyCode === 39 || e.keyCode === 68) {
		if (moveRight()) {
			e.preventDefault()

			setTimeout(() => generateOneNumver(), 210)
			setTimeout(() => isGameover(), 300)
		}
	} else if (e.keyCode === 40 || e.keyCode === 83) {
		if (moveDown()) {
			e.preventDefault()

			setTimeout(() => generateOneNumver(), 210)
			setTimeout(() => isGameover(), 300)
		}
	}
})

$('#newGameBtn').on('click', () => {
	newGame()
})

let startX = 0
let startY = 0
let endX = 0
let endY = 0

document.addEventListener('touchstart', e => {
	startX = event.touches[0].pageX
	startY = event.touches[0].pageY
})

document.addEventListener('touchend', e => {
	endX = event.changedTouches[0].pageX
	endY = event.changedTouches[0].pageY

	const deltaX = endX - startX
	const deltaY = endY - startY

	const absX = Math.abs(deltaX)
	const absY = Math.abs(deltaY)

	const clickWidth = support.documentWidth * 0.3

	/* 判断是否点击事件 */
	if (absX < clickWidth && absY < clickWidth) {
		return
	}

	// X 轴滑动
	if (absX > absY) {
		/* 右滑动 */
		if (deltaX > 0) {
			if (moveRight()) {
				e.preventDefault()

				setTimeout(() => generateOneNumver(), 210)
				setTimeout(() => isGameover(), 300)
			}
		} else {
			/* 左滑动 */
			if (moveLeft()) {
				e.preventDefault()

				setTimeout(() => generateOneNumver(), 210)
				setTimeout(() => isGameover(), 300)
			}
		}
	}
	// Y 轴滑动
	else {
		/* 下滑动 */
		if (deltaY > 0) {
			if (moveDown()) {
				e.preventDefault()

				setTimeout(() => generateOneNumver(), 210)
				setTimeout(() => isGameover(), 300)
			}
		} else {
			/* 上滑动 */
			if (moveUp()) {
				e.preventDefault()

				setTimeout(() => generateOneNumver(), 210)
				setTimeout(() => isGameover(), 300)
			}
		}
	}
})

document.addEventListener('touchmove', e => {
	e.preventDefault()
})
