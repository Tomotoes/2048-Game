window.langs = {
	en: {
		els: ['Score', 'Best', 'Restart'],
		introduce: {
			title: 'Game Rule',
			content:
				'You need to control all the squares to move in the same direction. Two squares with the same number will be combined into their sum after colliding with each other. After each operation, a 2 or 4 will be randomly generated. Finally, a " 2048" square will be considered a victory.'
		},
		gameOver: {
			buttons: ['Don\'t continue', 'Another round'],
			newMaxScoreTip: 'Wow, you made history!',
			failToNewMaxScoreTip: 'Stupid ah ~ please continue to work hard!'
		}
	},
	cn: {
		els: ['当前分数', '最高分数', '新的游戏'],
		introduce: {
			title: '游戏规则',
			content:
				'你需要控制所有方块向同一个方向运动，两个相同数字方块撞在一起之后合并成为他们的和，每次操作之后会随机生成一个2或者4，最终得到一个“2048”的方块就算胜利了。'
		},
		gameOver: {
			buttons: ['玩不动了', '再来一局'],
			newMaxScoreTip: '哇，你创造了历史！',
			failToNewMaxScoreTip: '笨蛋啊~ 请继续努力！'
		}
	}
}
window.lang =
	navigator && navigator.language
		? window.langs[navigator.language === 'zh-CN' ? 'cn' : 'en']
		: 'zn-CN'
;[...document.querySelectorAll('.lang')].forEach(
	(el, idx) => (el.textContent = lang.els[idx])
)
