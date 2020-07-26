import { state, startGame, initState } from './gameLogic'

const setInput = (value) => {
  console.log(value);
  console.log(state.movementVector)
  // Input is left/right
  if(value[0] === 1) {
    state.movementVector[0] = state.movementVector[2] === 1 ? -1 : state.movementVector[2] === -1 ? 1 : 0;
    state.movementVector[1] = 0;
    state.movementVector[2] = state.movementVector[1] === 1 ? 1 : state.movementVector[1] === -1 ? -1 : 0;
  // Input is up/down
  } else if(value[1] !== 0) {
    state.movementVector[0] = 0;
    state.movementVector[1] = 0;
    state.movementVector[2] = 0;
  }
  state.movementVector
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