import './main.css'
import { init } from './startup'
import { gameStateChanger, initState } from './helper/gameLogic'
import { animate } from './render'
import { bindInput } from './helper/input'

import config from './config'

const world = init(config);
bindInput(world)
initState()
setInterval(gameStateChanger, 1000)
animate(world)();
