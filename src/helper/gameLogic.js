import * as THREE from 'three';
import { updateSnake } from './gameRenderer'
import { inputInput } from './input'

import config from '../config'
const {
    PARTICLE_DIMENSION,
    START_SPEED,
    MAX_SPEED,
    SPEED_RAMP,
    TARGET_SCORE
} = config

// move snake by an interval (reference movement) and returns the oldTail by modifying the head, and
const moveSnake = (snakeBody, movementVector) => {
    const headPosition = snakeBody[0] 
    // MOVEMENT BY 3D
    const newHeadPosition = headPosition.clone()
    newHeadPosition.add(movementVector)
    snakeBody.unshift(newHeadPosition)
    const oldTail = snakeBody.pop()
    return oldTail
}

// returns random (x,y,z) coordinate of a food that does not belong in the occupancy of the snake
const randomLocationOfFood = (snakeBody) => {
    const notValidLocation = snakeBody

    const checkPointIsInvalid = (point, invalid) => invalid.some(hayElement => point.equals(hayElement))
    const generateRandomPoint = () => Math.floor(Math.random() * PARTICLE_DIMENSION)
    let randomLocation;
    do{
        randomLocation = new THREE.Vector3(generateRandomPoint(), generateRandomPoint(), generateRandomPoint());
    } while(checkPointIsInvalid(randomLocation, notValidLocation))

    return randomLocation
}

// CHECK IF SNAKE CAN IT FOOD - Logic: checks if the head is the same location as the food
const canSnakeEatFood = (foodLocation, snakeBody) => foodLocation.equals(snakeBody[0])

// MAKES SNAKE EAT FOOD
const snakeEatFood = (oldTail, snakeBody) => snakeBody.push(oldTail)

// CHECK SNAKE EAT IT SELF
const didSnakeEatSelf = (snakeBody) => {
    const head = snakeBody[0]
    return snakeBody.slice(1).some(segment => head.equals(segment))
}

// CHECK SNAKE HIT BOUNDARY
const willSnakeHitBoundary = (snakeBody, movementVector) => {
    const headPosition = snakeBody[0]
    const futureHeadPosition = headPosition.clone().add(movementVector)
    return !futureHeadPosition.toArray().every((headAxis) => 0 <= headAxis && headAxis < PARTICLE_DIMENSION)
}

// GAME STATE
let state = {}

const startGame = () => {
    if(state.playing === -1) initState()
    state.playing = 1;
    playGame()
}

const goFaster = () => {
    state.tickTime -= SPEED_RAMP
}

const initState = () => {
    state = {
        body: [],
        oldTail: {},
        foodLocation: new THREE.Vector3( 4, 4, 4 ),
        movementVector: new THREE.Vector3( 1, 0, 0 ),
        upVector: new THREE.Vector3( 0, 1, 0 ),
        score: 0,
        tickTime: START_SPEED,
        playing: 0
    }
    const head = new THREE.Vector3( 0, 4, 4 );
    const bodyLength = Math.pow(PARTICLE_DIMENSION, 3);
    for (let i = bodyLength; i >= 0; i--) {
        state.body.push(head.clone().add(new THREE.Vector3( 1, 0, 0 )))   
    }
    state.oldTail = state.body[bodyLength - 1]
}

const gameStateChanger = () => {
    if(willSnakeHitBoundary(state.body, state.movementVector)){
        state.playing = -1
        return false
    } else {
        state.oldTail = moveSnake(state.body, state.movementVector)
    }
    if (canSnakeEatFood(state.foodLocation, state.body)) {
        snakeEatFood(state.oldTail, state.body)
        state.score += TARGET_SCORE
        state.tickTime -= state.tickTime > MAX_SPEED ? SPEED_RAMP : 0
        state.foodLocation = randomLocationOfFood(state.body)
    }
    updateSnake()
    if(didSnakeEatSelf(state.body)){
        state.playing = -1
        return false
    }
    return true
}

const playGame = () => {
    if (state.playing !== 1) return
    inputInput()
    const alive = gameStateChanger()
    if (alive) setTimeout(playGame, state.tickTime)
}

export { playGame, gameStateChanger, state, initState, startGame, goFaster };