import { renderGame } from "./helper/gameRenderer"
import { state } from './helper/gameLogic'

const animate = (world) => () => {
  requestAnimationFrame( animate(world) );
  const {
    renderer,
    scene,
    camera,
    controls,
    validPositions,
    snake
  } = world;

  renderGame(snake, state, validPositions)
  controls.update();

  renderer.render( scene, camera );

}

export { animate };