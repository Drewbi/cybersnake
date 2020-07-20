import * as THREE from 'three';
import { OrbitControls } from './lib/orbitControl'
import Disc from './assets/disc.png'

const init = (config) => {

  const  {
    CUBE_SIZE,
    PARTICLE_DIMENSION,
    PARTICLE_SIZE,
    TARGET_SIZE,
  } = config;

  const container = document.getElementById( 'container' );

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 250;
  
  //

  const vertices = []
  for (let i = 0; i < PARTICLE_DIMENSION; i++) {
    const translateAmount = (CUBE_SIZE / PARTICLE_DIMENSION ) * i
    const transform = new THREE.Matrix4().makeTranslation(0, 0, translateAmount - CUBE_SIZE / 2 );
    const vert = new THREE.PlaneGeometry( CUBE_SIZE, CUBE_SIZE, PARTICLE_DIMENSION, PARTICLE_DIMENSION ).applyMatrix4(transform).vertices;
    vertices.push(...vert)
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

  //

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

  return { renderer, scene, camera, controls, particles }
}

export { init };