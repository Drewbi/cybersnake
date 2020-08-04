import { renderGame } from "./game/gameRenderer"
import { state } from './game/gameLogic'

const renderText = (state, gameInfo) => {
  if(state.playing === 0) gameInfo.innerHTML = "Press space to start playing"
  else if(state.playing === -1) gameInfo.innerHTML = `You ded, ${state.score} Points. Press space to restart`
  else if(state.playing === 1) gameInfo.innerHTML = `${state.score} Points`
  else if(state.playing === 2) gameInfo.innerHTML = "My god you've done it! You've won!"
}

const animate = (world) => () => {
  requestAnimationFrame( animate(world) );
  const {
    renderer,
    scene,
    camera,
    controls,
    vertpos,
    snake,
    target,
    gameInfo,
  } = world;

  renderText(state, gameInfo)
  renderGame(snake, target, state, vertpos)
  controls.update();

  renderer.render( scene, camera );

}

export { animate };