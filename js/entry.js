import 'css/style'

import './i18n'

import newGame from './main'

newGame(!localStorage.getItem('score'))

import './window'
