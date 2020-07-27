import { state, startGame, initState, goFaster } from './gameLogic'
import * as THREE from 'three';

let inputVal = [0, 0];

const setInput = (value) => {
  inputVal = value
}

const inputInput = () => {
  const quaternion = new THREE.Quaternion();
  
  // Input is right/left
  if(inputVal[0] !== 0) {
    quaternion.setFromAxisAngle( state.upVector.normalize(), inputVal[0] * Math.PI / 2 );
    state.movementVector.applyQuaternion( quaternion );
    state.movementVector.round()
  // Input is up/down
  } else if(inputVal[1] !== 0) {
    const cross = new THREE.Vector3().crossVectors(state.movementVector, state.upVector)
    state.upVector = inputVal[1] === -1 ? state.movementVector.clone().negate() : state.movementVector.clone()
    quaternion.setFromAxisAngle( cross.normalize(), ( -1 * inputVal[1]) * Math.PI / 2 );
    state.movementVector.applyQuaternion( quaternion );
    state.movementVector.round()
  }
  if (state.movementVector.y === 0) state.upVector.set(0, 1, 0) // Flips snake on his tummy
  inputVal = [0, 0]
}

const bindInput = () => {
  document.addEventListener('keydown', (event) => {
    if(event.keyCode == 37 || event.keyCode == 65) { // Left arrow or a
      setInput([-1, 0]);
    }
    else if(event.keyCode == 39 || event.keyCode == 68) { // Right arrow or d
      setInput([1, 0]);
    }
    else if(event.keyCode == 38 || event.keyCode == 87) { // Up arrow or w
      setInput([0, 1]);
    }
    else if(event.keyCode == 40 || event.keyCode == 83) { // Down arrow or s
      setInput([0, -1]);
    }
    else if(event.keyCode == 32 || event.keyCode == 13) { // Space or enter
      if ( state.playing !== 1 ) startGame();
      else if (state.playing === 1) goFaster()
    }
    else if(event.keyCode == 46 || event.keyCode == 27 || event.keyCode == 8) { // Delete or backspace
      if (state.playing === 1) initState()
    }
  });
}

export { inputInput, bindInput }