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

if (/micromessenger/i.test(navigator.userAgent)) {
	if (window.history.length == 1) {
		//判断是第一次从微信菜单进入页面
		//写入空白历史记录
		pushHistory()
	}

	//延时监听
	setTimeout(function() {
		//监听物理返回按钮
		window.addEventListener(
			'popstate',
			() => {
				closeWindow()
				pushHistory()
			},
			false
		)
	}, 300)
	function pushHistory() {
		window.history.pushState( { title: 'title', url: '#' }, 'title', '#' )
	}
}
