import * as THREE from 'three';
import { OrbitControls } from './lib/orbitControl'
import './main.css'
import Disc from './assets/disc.png'

var renderer, scene, camera, controls;

var particles;

var CUBE_SIZE = 200;
var PARTICLE_DIMENSION = 16;
var PARTICLE_SIZE = 10;
var TARGET_SIZE = 25;

var raycaster, intersects;
var mouse, INTERSECTED;
console.log('Starting Animation')
init();
animate();

function init() {

  var container = document.getElementById( 'container' );

  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.z = 250;
  
  
  //
  var vertices = []
  for (var i = 0; i < PARTICLE_DIMENSION; i++) {
    var translateAmount = (CUBE_SIZE / PARTICLE_DIMENSION ) * i
    var transform = new THREE.Matrix4().makeTranslation(0, 0, translateAmount - CUBE_SIZE / 2 );
    var vert = new THREE.PlaneGeometry( CUBE_SIZE, CUBE_SIZE, PARTICLE_DIMENSION, PARTICLE_DIMENSION ).applyMatrix4(transform).vertices;
    vertices.push(...vert)
  }

  //
  var positions = new Float32Array( vertices.length * 3 );
  var colors = new Float32Array( vertices.length * 3 );
  var sizes = new Float32Array( vertices.length );

  var vertex;
  var color = new THREE.Color();

  for ( var i = 0, l = vertices.length; i < l; i ++ ) {

    vertex = vertices[ i ];
    vertex.toArray( positions, i * 3 );

    color.setHSL( 0.01 + 0.1 * ( i / l ), 1.0, 0.5 );
    color.toArray( colors, i * 3 );

    sizes[ i ] = PARTICLE_SIZE * 0.5;

  }

  var geometry = new THREE.BufferGeometry();
  geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
  geometry.setAttribute( 'customColor', new THREE.BufferAttribute( colors, 3 ) );
  geometry.setAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );

  //

  var material = new THREE.ShaderMaterial( {

    uniforms: {
      color: { value: new THREE.Color( 0xffffff ) },
      pointTexture: { value: new THREE.TextureLoader().load( Disc ) }
    },
    vertexShader: document.getElementById( 'vertexshader' ).textContent,
    fragmentShader: document.getElementById( 'fragmentshader' ).textContent,

    alphaTest: 0.9

  } );

  //

  particles = new THREE.Points( geometry, material );
  scene.add( particles );
  
  // Snake stuff

  // var positions = []
  // var point = new THREE.Vector3(0,0,0);
  // var point1 = new THREE.Vector3(50, 50, 50);
  // positions.push(point)
  // position.push(point1)
  // var geo = new THREE.BufferGeometry();
  // geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  // geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  // matLineBasic = new THREE.LineBasicMaterial({ vertexColors: true });
  // matLineDashed = new THREE.LineDashedMaterial({ vertexColors: true, scale: 2, dashSize: 1, gapSize: 1 });

  // line1 = new THREE.Line(geo, matLineBasic);
  // line1.computeLineDistances();
  // line1.visible = false;
  // scene.add(line1);

  //

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );

  //
  controls = new OrbitControls( camera, renderer.domElement );
  controls.target.set( 0, 0.5, 0 );
  controls.update();
  controls.enablePan = false;
  controls.enableDamping = true;
  //

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  window.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

}

function onDocumentMouseMove( event ) {

  event.preventDefault();

  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

  requestAnimationFrame( animate );

  controls.update();

  render();

}

function render() {

  particles.rotation.x += 0.0005;
  particles.rotation.y += 0.001;

  var geometry = particles.geometry;
  var attributes = geometry.attributes;

  raycaster.setFromCamera( mouse, camera );

  intersects = raycaster.intersectObject( particles );

  if ( intersects.length > 0 ) {

    if ( INTERSECTED != intersects[ 0 ].index ) {

      attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE;

      INTERSECTED = intersects[ 0 ].index;

      attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE * 1.25;
      attributes.size.needsUpdate = true;

    }

  } else if ( INTERSECTED !== null ) {

    attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE;
    attributes.size.needsUpdate = true;
    INTERSECTED = null;

  }

  renderer.render( scene, camera );

}