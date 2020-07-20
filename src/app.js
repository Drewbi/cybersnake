import './main.css'
import { init } from './startup'
import { animate } from './render'

const config = {
  CUBE_SIZE: 100,
  PARTICLE_DIMENSION: 8,
  PARTICLE_SIZE: 10,
  TARGET_SIZE: 25,
}

const world = init(config);
animate(world)();
