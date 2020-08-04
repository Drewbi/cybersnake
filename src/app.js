import './main.css'
import { init } from './startup'
import { playGame, initState } from './game/gameLogic'
import { animate } from './render'
import { bindInput } from './game/input'

const world = init();
bindInput()
initState()
playGame()
animate(world)();
