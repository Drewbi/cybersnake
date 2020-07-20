const animate = (world) => () => {
  requestAnimationFrame( animate(world) );
  const {
    renderer,
    scene,
    camera,
    controls,
    particles
  } = world;

  controls.update();

  particles.rotation.x += 0.0001;
  particles.rotation.y += 0.001;

  renderer.render( scene, camera );

}

export { animate };