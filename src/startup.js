import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Disc from './assets/disc.png'
import { makeSnakeBody, makeSnakeEyes } from './helper/snake'
import config from './config'

const init = () => {

  const  {
    CUBE_SIZE,
    PARTICLE_DIMENSION,
    PARTICLE_SIZE,
    TARGET_SIZE,
  } = config;

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 200;
  camera.position.y = 100;
  
  // ============ Make Cube

  const vertices = []
  const vertpos = []
  for (let i = 0; i < PARTICLE_DIMENSION; i++) {
    const translateAmount = (CUBE_SIZE / PARTICLE_DIMENSION ) * i
    const transform = new THREE.Matrix4().makeTranslation(0, 0, translateAmount - CUBE_SIZE / 2 );
    const vert = new THREE.PlaneGeometry( CUBE_SIZE, CUBE_SIZE, PARTICLE_DIMENSION - 1, PARTICLE_DIMENSION - 1 ).applyMatrix4(transform).vertices;
    vertices.push(...vert)
    vertpos.push([])
    for (let j = 0; j < PARTICLE_DIMENSION; j++) {
        vertpos[i].push(vert.slice(j * PARTICLE_DIMENSION, j * PARTICLE_DIMENSION + PARTICLE_DIMENSION))    
    }
  }

  //
  const positions = new Float32Array( vertices.length * 3 );
  const colors = new Float32Array( vertices.length * 3 );
  const sizes = new Float32Array( vertices.length );

  const color = new THREE.Color();
  let vertex;
  
  for ( let i = 0, l = vertices.length; i < l; i ++ ) {

    vertex = vertices[ i ];
    vertex.toArray( positions, i * 3 );
    color.setHSL( 0.45 + 0.1 * ( i / l ), 1.0, 0.5 );
    color.toArray( colors, i * 3 );

    sizes[ i ] = PARTICLE_SIZE * 0.5;

  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  geometry.setAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
  geometry.setAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );

  //

  const material = new THREE.ShaderMaterial( {
    uniforms: {
      color: { value: new THREE.Color( 0xffffff ) },
      pointTexture: { value: new THREE.TextureLoader().load( Disc ) }
    },
    vertexShader: document.getElementById( 'vertexshader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
    alphaTest: 0.9
  } );

  //

  const particles = new THREE.Points( geometry, material );
  scene.add( particles );

  //========== target

  const targetPosition = new Float32Array( 3 );
  const targetColor = new Float32Array( 3 );
  const targetSize = new Float32Array( 1 );

  targetSize[0] = TARGET_SIZE;

  targetColor[0] = 0.9
  targetColor[1] = 0.6
  targetColor[2] = 0.6

  targetPosition[0] = 0;
  targetPosition[1] = 0;
  targetPosition[2] = 0;

  const targetGeometry = new THREE.BufferGeometry();
  targetGeometry.setAttribute( 'position', new THREE.BufferAttribute( targetPosition, 3 ) );
  targetGeometry.setAttribute( 'customColor', new THREE.BufferAttribute( targetColor, 3 ) );
  targetGeometry.setAttribute( 'size', new THREE.BufferAttribute( targetSize, 1 ) );

  const target = new THREE.Points( targetGeometry, material );
  scene.add( target );

  // Make Snake ---------------------

  const snake = new THREE.Group();
  snake.add(makeSnakeBody(vertpos));
  snake.add(makeSnakeEyes());
  scene.add(snake);

  // Renderer init -------------------

  const renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  const container = document.getElementById( 'container' );
  container.appendChild( renderer.domElement );

  // Controls init --------------------

  const controls = new OrbitControls( camera, renderer.domElement );
  controls.target.set( 0, 0.5, 0 );
  controls.update();
  controls.enablePan = false;
  controls.enableDamping = true;
  controls.autoRotate = true;
  controls.enabled  = false;

  // Resize window ----------------------

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  window.addEventListener( 'resize', onWindowResize, false );
  const gameInfo = document.getElementById( 'gameText' );

  return { renderer, scene, camera, controls, vertpos, snake, target, gameInfo }
}

export { init };