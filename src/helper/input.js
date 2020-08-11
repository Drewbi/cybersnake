import { state, startGame, initState } from './gameLogic'
import * as THREE from 'three';

const setInput = (value) => {
  const quaternion = new THREE.Quaternion();
  
  // Input is right/left
  if(value[0] !== 0) {
    quaternion.setFromAxisAngle( state.upVector.normalize(), value[0] * Math.PI / 2 );
    state.movementVector.applyQuaternion( quaternion );
    state.movementVector.round()
  // Input is up/down
  } else if(value[0] !== 0) {
    const cross = new THREE.Vector3().crossVectors(state.movementVector, state.upVector)
    state.upVector = value[1] === -1 ? state.movementVector.clone().negate() : state.movementVector.clone()
    quaternion.setFromAxisAngle( cross.normalize(), ( -1 * value[1]) * Math.PI / 2 );
    state.movementVector.applyQuaternion( quaternion );
    state.movementVector.round()
  }
  if (state.movementVector.y === 0) state.upVector.set(0, 1, 0) // Flips snake on his tummy
}

const bindInput = () => {
  document.addEventListener('keydown', (event) => {
    if(event.keyCode == 37 || event.keyCode == 65) {
      setInput([-1, 0]);
    }
    else if(event.keyCode == 39 || event.keyCode == 68) {
      setInput([1, 0]);
    }
    else if(event.keyCode == 38 || event.keyCode == 87) {
      setInput([0, 1]);
    }
    else if(event.keyCode == 40 || event.keyCode == 83) {
      setInput([0, -1]);
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