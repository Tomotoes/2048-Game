export const documentWidth = window.screen.availWidth
export let gridContainerWidth = 0.92 * documentWidth
export let cellSideLength = 0.18 * documentWidth
export let cellSpace = 0.04 * documentWidth

export function prepareForMobile() {
	if (documentWidth > 700) {
		gridContainerWidth = 500
		cellSpace = 20
		cellSideLength = 100
	}
	$('#grid-container').css({
		width: gridContainerWidth - 2 * cellSpace,
		height: gridContainerWidth - 2 * cellSpace,
		padding: cellSpace,
		'border-radius': 0.02 * gridContainerWidth
	})

	$('.grid-cell').css({
		width: cellSideLength,
		height: cellSideLength,
		'border-radius': 0.02 * cellSideLength
	})
}
export function getPosTop(i) {
	return i * (cellSideLength + cellSpace) + cellSpace
}
export function getPosLeft(j) {
	return j * (cellSideLength + cellSpace) + cellSpace
}
export function getNumberBackgroundColor(number) {
	switch (number) {
		case 2:
			return '#eee4da'
			break
		case 4:
			return '#ede0c8'
			break
		case 8:
			return '#f2b179'
			break
		case 16:
			return '#f25956'
			break
		case 32:
			return '#f67c5f'
			break
		case 64:
			return '#f65e3b'
			break
		case 128:
			return '#edcf72'
			break
		case 256:
			return '#edcc61'
			break
		case 512:
			return '#9c0'
			break
		case 1024:
			return '#33b5e5'
			break
		case 2048:
			return '#09c'
			break
		case 4096:
			return '#a6c'
			break
		case 8192:
			return '#93c'
			break
		default:
			return '#000'
			break
	}
}
export function getNumberColor(number) {
	if (number <= 4) {
		return '#776e65'
	}
	return '#fff'
}

export function noSpace(board) {
	for (let i = 0; i < 4; ++i) {
		for (let j = 0; j < 4; ++j) {
			if (board[i][j] === 0) {
				return false
			}
		}
	}
	return true
}

export function canMoveLeft(board) {
	for (let i = 0; i < 4; ++i) {
		for (let j = 1; j < 4; ++j) {
			if (board[i][j] !== 0) {
				if (board[i][j - 1] === 0 || board[i][j - 1] === board[i][j]) {
					return true
				}
			}
		}
	}
	return false
}
export function canMoveRight(board) {
	for (let i = 0; i < 4; ++i) {
		for (let j = 2; j >= 0; --j) {
			if (board[i][j] !== 0) {
				if (board[i][j + 1] === 0 || board[i][j + 1] === board[i][j]) {
					return true
				}
			}
		}
	}
	return false
}
export function canMoveUp(board) {
	for (let j = 0; j < 4; ++j) {
		for (let i = 1; i < 4; ++i) {
			if (board[i][j] !== 0) {
				if (board[i - 1][j] === 0 || board[i - 1][j] === board[i][j]) {
					return true
				}
			}
		}
	}
	return false
}
export function canMoveDown(board) {
	for (let j = 0; j < 4; ++j) {
		for (let i = 2; i >= 0; --i) {
			if (board[i][j] !== 0) {
				if (board[i + 1][j] === 0 || board[i + 1][j] === board[i][j]) {
					return true
				}
			}
		}
	}
	return false
}

export function noBlockHorizontal(row, col1, col2, board) {
	for (let i = col1 + 1; i < col2; ++i) {
		if (board[row][i] !== 0) {
			return false
		}
	}
	return true
}

export function noBlockVertical(col, row1, row2, board) {
	for (let i = row1 + 1; i < row2; ++i) {
		if (board[i][col] !== 0) {
			return false
		}
	}
	return true
}

export function noMove(board) {
	return !(
		canMoveDown(board) ||
		canMoveUp(board) ||
		canMoveLeft(board) ||
		canMoveRight(board)
	)
}
