import './main.css'
import { init } from './startup'
import { playGame, initState } from './helper/gameLogic'
import { animate } from './render'
import { bindInput } from './helper/input'

const world = init();
bindInput()
initState()
playGame()
animate(world)();
