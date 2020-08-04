import config from '../config'
import * as THREE from 'three';
const {
  PARTICLE_DIMENSION
} = config

let needsUpdate = true;
// let lastUpdate = Date.now();
// let lastBodyPositions = []
// let nextPos = {}

const updateSnake = () => {
  needsUpdate = true
}

const renderGame = (snake, target, state, vertices) => {
  state.foodLocation.clamp(new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( PARTICLE_DIMENSION - 1, PARTICLE_DIMENSION - 1, PARTICLE_DIMENSION - 1 ))
  state.body[0].clamp(new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( PARTICLE_DIMENSION - 1, PARTICLE_DIMENSION - 1, PARTICLE_DIMENSION - 1 ))
  // if (lastBodyPositions.length === 0) {
  //   nextPos = state.body[0].clone().add(state.movementVector)
  //   console.log('init');
  //   for (let segment = 0; segment < state.body.length; segment++) {
  //     const indices = state.body[segment]
  //     const pos = vertices[indices.x][indices.y][indices.z]
  //     lastBodyPositions.push(pos)
  //   }
  // }
  // const timeDiff = Date.now() - lastUpdate
  // lastBodyPositions[0].lerp(nextPos, timeDiff / state.tickTime )
  // const formattedLastPositions = []
  // for (let i = 0; i < lastBodyPositions.length; i++) {
  //   formattedLastPositions.push(lastBodyPositions[i].x)
  //   formattedLastPositions.push(lastBodyPositions[i].y)
  //   formattedLastPositions.push(lastBodyPositions[i].z)
  // }
  // snake.children[0].geometry.setPositions(formattedLastPositions)
  if (!needsUpdate) return
  // nextPos = state.body[0].clone().add(state.movementVector)
  // lastUpdate = Date.now();
  const targetPos = vertices[state.foodLocation.x][state.foodLocation.y][state.foodLocation.z]
  target.position.x = targetPos.x
  target.position.y = targetPos.y
  target.position.z = targetPos.z
  const newPos = []
  for (let segment = 0; segment < state.body.length; segment++) {
    const indices = state.body[segment]
    const pos = vertices[indices.x][indices.y][indices.z]
    // lastBodyPositions[segment] = pos
    newPos.push(pos.x, pos.y, pos.z)
  }
  //snake.children[0] is the snake body
  snake.children[0].geometry.setPositions(newPos)
  //snake.children[1] is the snake eyes
  snake.children[1].position.set(newPos[0],newPos[1],newPos[2]) 
  snake.children[1].lookAt(targetPos)
  needsUpdate = false
}

export { renderGame, updateSnake };