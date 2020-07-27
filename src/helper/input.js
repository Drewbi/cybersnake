import { state, startGame, initState } from './gameLogic'
import * as THREE from 'three';

const setInput = (value, snake) => {
  const quaternion = new THREE.Quaternion();
  
  // Input is right/left
  if(value[0] !== 0) {
    quaternion.setFromAxisAngle( snake.up.normalize(), value[0] * Math.PI / 2 );
    state.movementVector.applyQuaternion( quaternion );
    state.movementVector.round()
    console.log(state.movementVector);
  // Input is up/down
  } else if(value[1] !== 0) {
    const cross = new THREE.Vector3().crossVectors(state.movementVector, snake.up)
    snake.up = value[1] === -1 ? state.movementVector.clone().negate() : state.movementVector.clone()
    quaternion.setFromAxisAngle( cross.normalize(), ( -1 * value[1]) * Math.PI / 2 );
    state.movementVector.applyQuaternion( quaternion );
    state.movementVector.round()
  }
}

const bindInput = (world) => {
  document.addEventListener('keydown', (event) => {
    if(event.keyCode == 37 || event.keyCode == 65) {
      setInput([-1, 0], world.snake);
    }
    else if(event.keyCode == 39 || event.keyCode == 68) {
      setInput([1, 0], world.snake);
    }
    else if(event.keyCode == 38 || event.keyCode == 87) {
      setInput([0, 1], world.snake);
    }
    else if(event.keyCode == 40 || event.keyCode == 83) {
      setInput([0, -1], world.snake);
    }
    else if(event.keyCode == 32 || event.keyCode == 13) {
      startGame();
    }
    else if(event.keyCode == 46 || event.keyCode == 27 || event.keyCode == 8) {
      initState()
    }
  });
}

export { setInput, bindInput }