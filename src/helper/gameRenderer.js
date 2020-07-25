const renderGame = (snake, state, vertices) => {
  /**
   * if user register direction move => move snake
   * render new position array
   * else move forward??
   */
  // snake.geometry.setDrawRange( 0, state.body.length );

  // for (let segment = 0; segment < state.body.length; segment++) {
  //   const indices = state.body[segment]
  //   const pos = vertices[indices[0]][indices[1]][indices[2]]
  //   snake.position.x = pos.x
  //   snake.position.y = pos.y
  //   snake.position.z = pos.z
  // }
  snake.geometry.attributes.position.needsUpdate = true
}

export { renderGame };