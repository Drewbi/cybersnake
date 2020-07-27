import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Disc from './assets/disc.png'
import { Line2 } from 'three/examples/jsm/lines/Line2'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'

const init = (config) => {

  const  {
    CUBE_SIZE,
    PARTICLE_DIMENSION,
    PARTICLE_SIZE,
    TARGET_SIZE,
  } = config;

  const container = document.getElementById( 'container' );
  const gameInfo = document.getElementById( 'gameText' );

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 250;
  
  //

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
  
  // const validPositions = []
  // const delim = CUBE_SIZE / PARTICLE_DIMENSION;
  // for (let i = 0; i < PARTICLE_DIMENSION; i++) {
  //   let x = delim * i
  //   validPositions.push([])
  //   for (let j = 0; j < PARTICLE_DIMENSION; j++) {
  //     let y = delim * j
  //     validPositions[i].push([])
  //     for (let k = 0; k < PARTICLE_DIMENSION; k++) {
  //       validPositions[i][j].push({ x, y, z: delim * k})
  //     }
  //   }
  // }

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

  //========== snake body start here

  var snakeyPositions = [] //store all the snake body location
  var snakeyPoint = vertpos[4][4][4];
  var snakeyColor = new THREE.Color(0x55ffaa);

  snakeyPositions.push(snakeyPoint.x, snakeyPoint.y, snakeyPoint.z)
  snakeyPositions.push(snakeyPoint.x, snakeyPoint.y, snakeyPoint.z)
  snakeyPositions.push(snakeyPoint.x, snakeyPoint.y, snakeyPoint.z)
  // snakeyPositions.push(snakeyPoint.x + CUBE_SIZE/PARTICLE_DIMENSION, snakeyPoint.y, snakeyPoint.z)
  // snakeyPositions.push(snakeyPoint.x + (2*CUBE_SIZE)/PARTICLE_DIMENSION, snakeyPoint.y, snakeyPoint.z)
  //for each point/position, push 3 separate colour val into colour array
  var snakeyColours = new Array(snakeyPositions.length)
  for(var i = 0; i < snakeyPositions.length; i++){
    snakeyColours.fill(snakeyColor.r, i * 3 )
    snakeyColours.fill(snakeyColor.g, i * 3 + 1)
    snakeyColours.fill(snakeyColor.b, i * 3 + 2)
  }

  var lineGeometry = new LineGeometry();//marry location & colours into geometry object
  lineGeometry.setPositions(snakeyPositions);
  lineGeometry.setColors(snakeyColours);

  var matLine = new LineMaterial({
    color: 0xffffff,
    linewidth: 0.02, // in pixels
    vertexColors: true,
    dashed: false
  });

  var snake = new Line2(lineGeometry, matLine);
  snake.computeLineDistances();
  snake.scale.set(1, 1, 1);
  scene.add(snake);

  console.log(snake);

  // ========== snake body ends here

  const renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  //
  const controls = new OrbitControls( camera, renderer.domElement );
  controls.target.set( 0, 0.5, 0 );
  controls.update();
  controls.enablePan = false;
  controls.enableDamping = true;
  //

  const onWindowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  }

  window.addEventListener( 'resize', onWindowResize, false );

  return { renderer, scene, camera, controls, vertpos, snake, target, gameInfo }
}

export { init };