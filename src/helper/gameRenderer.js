import config from '../config'
const {
  PARTICLE_DIMENSION
} = config

const renderGame = (snake, target, state, vertices) => {
  if (!state.foodLocation.every(location => location >= 0 && location < PARTICLE_DIMENSION)) return
  if (!state.body[0].every(location => location >= 0 && location < PARTICLE_DIMENSION)) return
  const targetPos = vertices[state.foodLocation[0]][state.foodLocation[1]][state.foodLocation[2]]
  target.position.x = targetPos.x
  target.position.y = targetPos.y
  target.position.z = targetPos.z
  const newPos = []
  for (let segment = 0; segment < state.body.length; segment++) {
    const indices = state.body[segment]
    const pos = vertices[indices[0]][indices[1]][indices[2]]
    newPos.push(pos.x, pos.y, pos.z)
  }
  snake.geometry.setPositions(newPos)
  snake.geometry.verticesNeedUpdate = true;
}

export { renderGame };