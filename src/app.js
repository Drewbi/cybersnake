import * as THREE from 'three';
import { Line2 } from "./lib/Line2";
import { LineMaterial } from './lib/LineMaterial';
import { LineGeometry } from './lib/LineGeometry';
import { OrbitControls } from './lib/orbitControl'
import Disc from './assets/disc.png'

var renderer, scene, camera,controls,particles;
var line;

var MAX_POINTS = 500;
var CUBE_SIZE = 50;
var PARTICLE_DIMENSION = 10;
const UNIT=CUBE_SIZE/PARTICLE_DIMENSION;
var PARTICLE_SIZE = 3;


var SNAKE_LAST_INDEX=1;
var snakepositions = [
    0,0,0,
    UNIT,0,0
]

init();
animate();

function init() {

    var container = document.getElementById('container');
    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(renderer.domElement);
    container.appendChild(renderer.domElement);

    
    // scene
    scene = new THREE.Scene();
    
    // camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    // camera.position.set(0, 0, 1000);
    camera.position.z = 80;

    //orbit control
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.5, 0);
    controls.update();
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.enableZoom = false;

    const vertices = []
    for (let i = 0; i < PARTICLE_DIMENSION; i++) {
        const translateAmount = (CUBE_SIZE / PARTICLE_DIMENSION) * i
        const transform = new THREE.Matrix4().makeTranslation(0, 0, translateAmount - CUBE_SIZE / 2);
        const vert = new THREE.PlaneGeometry(CUBE_SIZE, CUBE_SIZE, PARTICLE_DIMENSION, PARTICLE_DIMENSION).applyMatrix4(transform).vertices;
        vertices.push(...vert)
    }

    //
    const positions = new Float32Array(vertices.length * 3);
    const colors = new Float32Array(vertices.length * 3);
    const sizes = new Float32Array(vertices.length);

    const color = new THREE.Color();
    let vertex;

    for (let i = 0, l = vertices.length; i < l; i++) {

        vertex = vertices[i];
        vertex.toArray(positions, i * 3);

        color.setHSL(0.45 + 0.1 * (i / l), 1.0, 0.5);
        color.toArray(colors, i * 3);

        sizes[i] = PARTICLE_SIZE * 0.5;

    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    //

    const material = new THREE.ShaderMaterial({
        uniforms: {
            color: { value: new THREE.Color(0xffffff) },
            pointTexture: { value: new THREE.TextureLoader().load(Disc) }
        },
        vertexShader: document.getElementById('vertexshader').textContent,
        fragmentShader: document.getElementById('fragmentshader').textContent,
        alphaTest: 0.4
    });

    //

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    console.log(scene)

  //
    
    // geometry
    var linegeometry = new LineGeometry();

    // attributes
    var linepositions = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
    linegeometry.setPositions(linepositions);


    // material
    var linematerial = new LineMaterial({ color: 0xff0000, linewidth: 5 });
    linematerial.resolution.set(window.innerWidth, window.innerHeight);

    // line
    line = new Line2(linegeometry, linematerial);
    scene.add(line);

    // update positions
    // updatePositions();
    document.addEventListener("keydown", onDocumentKeyDown, false);

}

// update positions
function updatePositions(keyCode) {

    //var positions = line.geometry.attributes.position.array;
    // var positions = [];
    // var x = 0;
    // var y = 0;
    // var z = 0;
    // var index = 0;

    // for (var i = 0, l = MAX_POINTS; i < l; i++) {

    //     x += (Math.random() - 0.5) * 30;
    //     y += (Math.random() - 0.5) * 30;
    //     z += (Math.random() - 0.5) * 30;

    //     positions[index++] = x;
    //     positions[index++] = y;
    //     positions[index++] = z;

    // }
    // positions[0]=0;
    // positions[1]=0;
    // positions[2]=0;
    // positions[3] = 10;//looking at +x(right)
    // positions[4] = 0;//looking at +x
    // positions[5] = 0;//looking at +x
    // positions[6] = 10;//looking at +y (up)
    // positions[7] = 10;//looking at +y
    // positions[8] = 0;//looking at +y
    // positions[9] = 10;//looking at +z(point out screen)
    // positions[10] = 10;//looking at +z
    // positions[11] = 10;//looking at +z

    if (keyCode == 37) {//* 37 -> left -> x--
        snakepositions[3 * (SNAKE_LAST_INDEX + 1)] = snakepositions[3 * (SNAKE_LAST_INDEX)] - UNIT
        snakepositions[3 * (SNAKE_LAST_INDEX + 1) + 1] = snakepositions[3 * (SNAKE_LAST_INDEX) + 1]
        snakepositions[3 * (SNAKE_LAST_INDEX + 1) + 2] = snakepositions[3 * (SNAKE_LAST_INDEX) + 2]
        SNAKE_LAST_INDEX++;
    }
    else if (keyCode == 38) {//* 38 -> up -> y++
        snakepositions[3 * (SNAKE_LAST_INDEX + 1)] = snakepositions[3 * (SNAKE_LAST_INDEX)]
        snakepositions[3 * (SNAKE_LAST_INDEX + 1) + 1] = snakepositions[3 * (SNAKE_LAST_INDEX) + 1] + UNIT
        snakepositions[3 * (SNAKE_LAST_INDEX + 1) + 2] = snakepositions[3 * (SNAKE_LAST_INDEX) + 2]
        SNAKE_LAST_INDEX++;
    }
    else if (keyCode == 39) {//* 39 -> right -> x++
        snakepositions[3 * (SNAKE_LAST_INDEX + 1)] = snakepositions[3 * (SNAKE_LAST_INDEX)] + UNIT
        snakepositions[3 * (SNAKE_LAST_INDEX + 1) + 1] = snakepositions[3 * (SNAKE_LAST_INDEX) + 1]
        snakepositions[3 * (SNAKE_LAST_INDEX + 1) + 2] = snakepositions[3 * (SNAKE_LAST_INDEX) + 2]
        SNAKE_LAST_INDEX++;
    }
    else if (keyCode == 40) {//* 40 -> down -> y--
        snakepositions[3 * (SNAKE_LAST_INDEX + 1)] = snakepositions[3 * (SNAKE_LAST_INDEX)]
        snakepositions[3 * (SNAKE_LAST_INDEX + 1) + 1] = snakepositions[3 * (SNAKE_LAST_INDEX) + 1] - UNIT
        snakepositions[3 * (SNAKE_LAST_INDEX + 1) + 2] = snakepositions[3 * (SNAKE_LAST_INDEX) + 2]
        SNAKE_LAST_INDEX++;
    }
    else if (keyCode == 73) {//* 73 -> i(in) -> z++
        snakepositions[3 * (SNAKE_LAST_INDEX + 1)] = snakepositions[3 * (SNAKE_LAST_INDEX)]
        snakepositions[3 * (SNAKE_LAST_INDEX + 1) + 1] = snakepositions[3 * (SNAKE_LAST_INDEX) + 1]
        snakepositions[3 * (SNAKE_LAST_INDEX + 1) + 2] = snakepositions[3 * (SNAKE_LAST_INDEX) + 2] + UNIT
        SNAKE_LAST_INDEX++;
    }
    else if (keyCode == 79) {//* 79 -> o(out) -> z--
        snakepositions[3 * (SNAKE_LAST_INDEX + 1)] = snakepositions[3 * (SNAKE_LAST_INDEX)]
        snakepositions[3 * (SNAKE_LAST_INDEX + 1) + 1] = snakepositions[3 * (SNAKE_LAST_INDEX) + 1]
        snakepositions[3 * (SNAKE_LAST_INDEX + 1) + 2] = snakepositions[3 * (SNAKE_LAST_INDEX) + 2] - UNIT
        SNAKE_LAST_INDEX++;
    }
    console.log(snakepositions)
    console.log(line)

    line.geometry.setPositions(snakepositions)

}
/**
 * 37 -> left -> x--
 * 38 -> up -> y++
 * 39 -> right -> x++
 * 40 -> down -> y--
 * 73 -> i(in) -> z++
 * 79 -> o(out) -> z--
 */
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 65) {//left-A
        particles.rotation.y -= 90* (Math.PI / 180);
        line.rotation.y -= 90 * (Math.PI / 180);
        console.log("press left")
    } 
    else if (keyCode == 87) {//up-W
        particles.rotation.x -= 90 * (Math.PI / 180);
        line.rotation.x -= 90 * (Math.PI / 180);
        console.log("press up")
    }
    else if (keyCode == 68) {//right-D
        particles.rotation.y += 90 * (Math.PI / 180);
        line.rotation.y += 90 * (Math.PI / 180);
        console.log("press right")
    }
    else if (keyCode == 83) {//down-S
        particles.rotation.x += 90 * (Math.PI / 180);
        line.rotation.x += 90 * (Math.PI / 180);
        console.log("press down")
    }
    else{
        updatePositions(keyCode);
    }
};

// render
function render() {

    renderer.render(scene, camera);

}

// animate
function animate() {

    requestAnimationFrame(animate);

    // drawCount = (drawCount + 1) % MAX_POINTS;

    line.geometry.instancedCount = SNAKE_LAST_INDEX+1;
    console.log(SNAKE_LAST_INDEX)

    // if (drawCount === 0) {

        // periodically, generate new data

        // updatePositions();

    //     line.material.color.setHSL(Math.random(), 1, 0.5);

    // }

    // line.geometry.setPositions(snakepositions)
    controls.update();
    line.geometry.attributes.position.needsUpdate = true; // required after the first render

    render();

}
