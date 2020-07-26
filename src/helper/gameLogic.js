const NUMBER_OF_DIMENSIONS = 3 // Will always be 3
import * as THREE from 'three';
import { updateSnake } from './gameRenderer'

import config from '../config'
const {
    PARTICLE_DIMENSION, CUBE_SIZE
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

// returns random (x,y,z) coordinate of a food that does not belong in the occupancy of the snake, adds to the previous position
const randomLocationOfFood = (snakeBody) => {
    const notValidLocation = snakeBody

    // FINDING NEEDLE IN A HAY
    const checkArrayInArray = (needleArray,hayArray) => hayArray.some(hayElement => needleArray.every((needleElement,index)=>needleElement===hayElement[index]))

    //RANDOMLY GENERATE THE LOCATION OF FOOD
    let randomLocation;
    do{
        randomLocation = Array.from({length: PARTICLE_DIMENSION}, () => Math.floor(Math.random() * PARTICLE_DIMENSION));
    } while(!checkArrayInArray(randomLocation,notValidLocation))

    return randomLocation
}

// CHECK IF SNAKE CAN IT FOOD - Logic: checks if the head is the same location as the food
const canSnakeEatFood = (foodLocation, snakeBody) => foodLocation.equals(snakeBody[0])

// MAKES SNAKE EAT FOOD
const snakeEatFood = (oldTail, snakeBody) => snakeBody.push(oldTail)

// CHECK SNAKE EAT IT SELF
const didSnakeEatSelf = (snakeBody) => {
    const set = new Set(snakeBody)
    return set.size !== snakeBody.length
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
}

const initState = () => {
    state = {
        body: [],
        oldTail: new THREE.Vector3( 6, 4, 4 ),
        foodLocation: new THREE.Vector3( 1, 1, 0 ),
        movementVector: new THREE.Vector3( 1, 0, 0 ),
        upVector: new THREE.Vector3( 0, 1, 0 ),
        score: 0,
        playing: 0
    }
    const head = new THREE.Vector3( 3, 4, 4 );
    const bodyLength = 3;
    for (let i = bodyLength - 1; i >= 0; i--) {
        state.body.push(head.clone().add(new THREE.Vector3( i, 0, 0 )))   
    }
}

// MANIPULATES THE STATE - returns TRUE if valid, or FALSE for game over
const gameStateChanger = () => {
    if (state.playing !== 1) return
    if(willSnakeHitBoundary(state.body, state.movementVector)){
        state.playing = -1
    } else {
        state.oldTail = moveSnake(state.body, state.movementVector)
    }
    if (canSnakeEatFood(state.foodLocation, state.body)) {
        snakeEatFood(state.oldTail, state.body)
        state.score += 10
        state.foodLocation = randomLocationOfFood(state.body)
    }
    else if(didSnakeEatSelf(state.body)){
        state.playing = -1
    }
    updateSnake()
}

export { gameStateChanger, state, initState, startGame };