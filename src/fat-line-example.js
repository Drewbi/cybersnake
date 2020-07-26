//https://jsfiddle.net/brLk6aud/1/
import * as THREE from 'three';
import { Line2 } from './lib/Line2';
import { LineMaterial } from './lib/LineMaterial';
import { LineGeometry } from "./lib/LineGeometry";

var renderer, scene, camera;

var line;
var MAX_POINTS = 500;
var drawCount = 0;

init();
animate();

function init() {

    // info
    var info = document.createElement('div');
    info.style.position = 'absolute';
    info.style.top = '30px';
    info.style.width = '100%';
    info.style.textAlign = 'center';
    info.style.color = '#fff';
    info.style.fontWeight = 'bold';
    info.style.backgroundColor = 'transparent';
    info.style.zIndex = '1';
    info.style.fontFamily = 'Monospace';
    info.innerHTML = "three.js animataed line using BufferGeometry";
    document.body.appendChild(info);

    // renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // scene
    scene = new THREE.Scene();

    // camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, 1000);

    // geometry
    var geometry = new LineGeometry();

    // attributes
    var positions = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
    geometry.setPositions(positions);


    // material
    var material = new LineMaterial({ color: 0xff0000, linewidth: 20 });
    material.resolution.set(window.innerWidth, window.innerHeight);

    // line
    line = new Line2(geometry, material);
    scene.add(line);

    // update positions
    updatePositions();

}

// update positions
function updatePositions() {

    //var positions = line.geometry.attributes.position.array;
    var positions = [];
    var x = 0;
    var y = 0;
    var z = 0;
    var index = 0;

    for (var i = 0, l = MAX_POINTS; i < l; i++) {

        x += (Math.random() - 0.5) * 30;
        y += (Math.random() - 0.5) * 30;
        z += (Math.random() - 0.5) * 30;

        positions[index++] = x;
        positions[index++] = y;
        positions[index++] = z;

    }

    line.geometry.setPositions(positions)

}

// render
function render() {

    renderer.render(scene, camera);

}

// animate
function animate() {

    requestAnimationFrame(animate);

    drawCount = (drawCount + 1) % MAX_POINTS;

    line.geometry.maxInstancedCount = drawCount;

    if (drawCount === 0) {

        // periodically, generate new data

        updatePositions();

        line.material.color.setHSL(Math.random(), 1, 0.5);

    }

    render();

}
