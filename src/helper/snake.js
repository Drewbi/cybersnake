import * as THREE from 'three';
import { Line2 } from 'three/examples/jsm/lines/Line2'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
import config from '../config'

const { PARTICLE_DIMENSION } = config

const makeSnakeBody = (vertices) => {
  const snakeyPositions = new Array(Math.pow(PARTICLE_DIMENSION, 3)) //store all the snake body location
  const snakeyPoint = vertices[0][4][4];
  const snakeyColor = new THREE.Color(0x55ffaa);

  for (let i = 0; i < snakeyPositions.length; i += 3) {
    snakeyPositions[i] = snakeyPoint.x
    snakeyPositions[i + 1] = snakeyPoint.y
    snakeyPositions[i + 2] = snakeyPoint.z
    
  }
  
  //for each point/position, push 3 separate colour val into colour array
  const snakeyColours = new Array(snakeyPositions.length * 3)
  for(let i = 0; i < snakeyPositions.length; i++){
    snakeyColours.fill(snakeyColor.r, i * 3 )
    snakeyColours.fill(snakeyColor.g, i * 3 + 1)
    snakeyColours.fill(snakeyColor.b, i * 3 + 2)
  }

  const lineGeometry = new LineGeometry();//marry location & colours into geometry object
  lineGeometry.setPositions(snakeyPositions);
  lineGeometry.setColors(snakeyColours);
  const matLine = new LineMaterial({
    linewidth: 0.015, // in pixels
    vertexColors: true,
    dashed: false
  });

  const body = new Line2(lineGeometry, matLine);
  body.computeLineDistances();
  body.scale.set(1, 1, 1);

  return body
}

const makeSnakeEyes = () => {
  const eyeballgeometry = new THREE.SphereGeometry(1.5, 32, 32);
  const eyeballmaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const eyeball = new THREE.Mesh(eyeballgeometry, eyeballmaterial);
  eyeball.position.set(1.5,0,0);
  const eyegeometry = new THREE.SphereGeometry(1, 32, 32);
  const eyematerial = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const eye = new THREE.Mesh(eyegeometry, eyematerial);
  eye.position.set(1.5, 0, 0.6)

  const eyes = new THREE.Group();
  eyes.add(eye);
  eyes.add(eyeball);
  eyes.add(eye.clone().translateX(-2.5));
  eyes.add(eyeball.clone().translateX(-2.5));
  return eyes
}

export { makeSnakeBody, makeSnakeEyes }