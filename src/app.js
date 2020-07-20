import * as THREE from 'three';
import { OrbitControls } from './lib/orbitControl'
import { LineGeometry} from './lib/LineGeometry'
import {LineMaterial} from './lib/LineMaterial'
import {Line2} from './lib/Line2'
import './main.css'
import Disc from './assets/disc.png'

var renderer, scene, camera, controls;

var particles,snakeyLine;

var CUBE_SIZE = 50;
var PARTICLE_DIMENSION = 10;
var PARTICLE_SIZE = 5;
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
  camera.position.z = 80;
  
  
  //
  var vertices = []
  for (var i = 0; i < PARTICLE_DIMENSION; i++) {
    var translateAmount = (CUBE_SIZE / PARTICLE_DIMENSION ) * i
    var transform = new THREE.Matrix4().makeTranslation(0, 0, translateAmount - CUBE_SIZE / 2 );
    var vert = new THREE.PlaneGeometry( CUBE_SIZE, CUBE_SIZE, PARTICLE_DIMENSION, PARTICLE_DIMENSION ).applyMatrix4(transform).vertices;
    vertices.push(...vert)
  }
  console.log(vertices)

  //
  var positions = new Float32Array( vertices.length * 3 );
  var colors = new Float32Array( vertices.length * 3 );
  var sizes = new Float32Array( vertices.length );

  var vertex;
  var color = new THREE.Color(0xffffff);

  for ( var i = 0, l = vertices.length; i < l; i ++ ) {

    vertex = vertices[ i ];
    vertex.toArray( positions, i * 3 );

    // color.setHSL(1,1,1);
    color.toArray( colors, i * 3 );

    sizes[ i ] = PARTICLE_SIZE ;

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
  var snakeyMaterial = new THREE.ShaderMaterial({

    uniforms: {
      color: { value: new THREE.Color(0x00ff00) },
      pointTexture: { value: new THREE.TextureLoader().load(Disc) }
    },
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent,

    alphaTest: 0.9

  });
  //

  particles = new THREE.Points( geometry, material );
  scene.add( particles );

  // make a big dot
  // var snakeyPositions = new Float32Array(3);
  // var snakeyColors = new Float32Array(3);
  // var snakeySizes = new Float32Array(1);

  // var dot = new THREE.Vector3(0,0,0);
  // dot.toArray(snakeyPositions, 0);

  // var dotColor = new THREE.Color(0x00ff00)
  // dotColor.toArray(snakeyColors,0)

  // snakeySizes[0] = 5;

  // var snakeyGeometry = new THREE.BufferGeometry();
  // snakeyGeometry.setAttribute('position', new THREE.BufferAttribute(snakeyPositions, 3));
  // snakeyGeometry.setAttribute('customColor', new THREE.BufferAttribute(snakeyColors, 3));
  // snakeyGeometry.setAttribute('size', new THREE.BufferAttribute(snakeySizes, 1));

  // var bigDot = new THREE.Points(snakeyGeometry, snakeyMaterial);
  // scene.add(bigDot);

  //
  // snakeyL ( LineGeometry, LineMaterial )

  var snakeyPositions = []
  
  var snakeyPoint = vertices[Math.floor(Math.random() * vertices.length)] //chose a random point from the grid
  var snakeyColor = new THREE.Color(0xff0000);

  snakeyPositions.push(snakeyPoint.x,snakeyPoint.y,snakeyPoint.z)
  snakeyPositions.push(snakeyPoint.x+5, snakeyPoint.y, snakeyPoint.z)
  snakeyPositions.push(snakeyPoint.x + 10, snakeyPoint.y, snakeyPoint.z)

  //for each point/position, push 3 separate colour val into colour array
  var snakeyColours = new Array(snakeyPositions.length)
  for(var i=0;i<snakeyPositions.length-1;i++){
    snakeyColours.fill(snakeyColor.r, i * 3 )
    snakeyColours.fill(snakeyColor.g, i * 3 + 1)
    snakeyColours.fill(snakeyColor.b, i * 3 + 2)

  }
  console.log(snakeyColours)

  var geometry = new LineGeometry();
  geometry.setPositions(snakeyPositions);
  geometry.setColors(snakeyColours);

  var matLine = new LineMaterial({

    color: 0xff0000,
    linewidth: 0.02, // in pixels
    vertexColors: true,
    //resolution:  // to be set by renderer, eventually
    dashed: false

  });

  snakeyLine = new Line2(geometry, matLine);
  snakeyLine.computeLineDistances();
  snakeyLine.scale.set(1, 1, 1);
  scene.add(snakeyLine);

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
  controls.enableZoom = false;
  //

  raycaster = new THREE.Raycaster();
  // mouse = new THREE.Vector2();

  window.addEventListener( 'resize', onWindowResize, false );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );

}

function onDocumentMouseMove( event ) {

  event.preventDefault();

  // mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  // mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

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

  snakeyLine.rotation.x += 0.0005;
  snakeyLine.rotation.y += 0.001;

  renderer.render( scene, camera );

}