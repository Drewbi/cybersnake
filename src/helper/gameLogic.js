const NUMBER_OF_DIMENSIONS = 3 // Will always be 3



import config from '../config'
const {
    PARTICLE_DIMENSION, CUBE_SIZE
} = config

// move snake by an interval (reference movement) and returns the oldTail by modifying the head, and
const moveSnake = (arraySnakeBody, movementVector = [1,0,0]) => {
    const headPosition = [...arraySnakeBody[0]] // clone

    // MOVEMENT BY 3D
    const newHeadPosition = headPosition
    for (let i = 0; i < NUMBER_OF_DIMENSIONS; i++){
        newHeadPosition[i] = newHeadPosition[i] + movementVector[i]
    }

    arraySnakeBody.unshift(newHeadPosition)
    const oldTail = arraySnakeBody.pop()
    return oldTail
}

// returns random (x,y,z) coordinate of a food that does not belong in the occupancy of the snake, adds to the previous position
const randomLocationOfFood = (arraySnakeBody) => {
    const notValidLocation = arraySnakeBody

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
const canSnakeEatFood = (foodLocation,snakeBody) =>foodLocation.every((foodLocationAxis,index)=> foodLocation=== snakeBody[0][index])

// MAKES SNAKE EAT FOOD
const snakeEatFood = (oldTail, arraySnakeBody) => arraySnakeBody.push(oldTail)

// CHECK SNAKE EAT IT SELF
const didSnakeEatSelf = (snakeBody) => {
    const set = new Set(snakeBody)
    return set.size !== snakeBody.length
}

// CHECK SNAKE HIT BOUNDARY
const didSnakeHitBoundary = (snakeBody) => {
    const head = snakeBody[0]
    console.log(head);
    return !head.every((headElement) => 0 <= headElement && headElement < PARTICLE_DIMENSION)
}

// GAME STATE
let state = {}

const startGame = () => {
    if(state.playing === -1) initState()
    state.playing = 1;
}

const initState = () => {
    state = {
        body: [[4, 4, 4], [5, 4, 4], [6, 4, 4]],
        oldTail: [6, 4, 4],
        foodLocation: [1, 1, 0],
        movementVector: [1, 0, 0],
        upVector: [0, 1, 0],
        score: 0,
        playing: 0
    }
}

// MANIPULATES THE STATE - returns TRUE if valid, or FALSE for game over
const gameStateChanger = () => {
    console.log(state.playing)
    if (state.playing !== 1) return
    state.oldTail = moveSnake(state.body, state.movementVector)

    if (canSnakeEatFood(state.foodLocation, state.body)) {
        snakeEatFood(state.oldTail, state.body)
        state.score += 10
        state.foodLocation = randomLocationOfFood(state.body)
    }
    else if(didSnakeEatSelf(state.body) || didSnakeHitBoundary(state.body)){
        state.playing = -1
    }
}

export { gameStateChanger, state, initState, startGame };