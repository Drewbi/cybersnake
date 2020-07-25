import './main.css'
import { init } from './startup'
import { gameStateChanger } from './helper/gameLogic'
import { animate } from './render'
import { bindInput } from './helper/input'

import config from './config'

const world = init(config);
bindInput()
setInterval(gameStateChanger, 1000)
animate(world)();
