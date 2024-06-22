import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { Kirby } from './kirby';
import { Input } from './input';

class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
      this.obj = obj;
      this.minProp = minProp;
      this.maxProp = maxProp;
      this.minDif = minDif;
    }
    get min() {
      return this.obj[this.minProp];
    }
    set min(v) {
      this.obj[this.minProp] = v;
      this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
    }
    get max() {
      return this.obj[this.maxProp];
    }
    set max(v) {
      this.obj[this.maxProp] = v;
      this.min = this.min;  // this will call the min setter
    }
  }

//Setup canvas render
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


//Setup Scene and Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const size = 1;
// const camera = new THREE.OrthographicCamera( - size, size, size, - size, 0.1,1000 );
camera.position.set( 0, 0, 100 );
camera.zoom = 0.2;
camera.lookAt( 0, 0, 0 );


function updateCamera() {
    camera.updateProjectionMatrix();
}
   
const gui = new GUI();
// gui.add(camera, 'fov', 1, 180).onChange(updateCamera);
const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1);
gui.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
gui.add(minMaxGUIHelper, 'max', 0.1, 1000, 0.1).name('far').onChange(updateCamera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 5, 0);
controls.update();


//Hemisphere Light
var skyColor = 0xB1E1FF;  // light blue
var groundColor = 0xB97A20;  // brownish orange
var intensity = 0.5;
var light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
scene.add(light);

//Directional Light
var color = 0xFFFFFF;
light = new THREE.DirectionalLight(color, intensity);
light.position.set(0, 10, 0);
light.target.position.set(-5, 0, 0);
scene.add(light);
scene.add(light.target);

//Point Light
intensity = 50;
color = 0xFFFF00;
light = new THREE.PointLight(color, intensity);
light.position.set(0,10,0);
scene.add(light);

//Spot Light
color = 0xFF0000;
light = new THREE.SpotLight(color, intensity);
light.position.set(10,10,0);
scene.add(light);



const planeSize = 40;
var planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
var planeMat = new THREE.MeshPhongMaterial({
    color: 0x888888,
    side: THREE.DoubleSide,
});

var mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -.5;
scene.add(mesh);

{
    const cubeSize = 4;
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMat = new THREE.MeshPhongMaterial({color: '#8AC'});
    const mesh = new THREE.Mesh(cubeGeo, cubeMat);
    mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
    scene.add(mesh);
  }
  {
    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshPhongMaterial({color: '#CA8'});
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(mesh);
  }

  const onProgress = function ( xhr ) {

    if ( xhr.lengthComputable ) {

      const percentComplete = xhr.loaded / xhr.total * 100;
      console.log( percentComplete.toFixed( 2 ) + '% downloaded' );

    }

  };

  //Load Obj
  new MTLLoader()
  .setPath( 'resources/' )
  .load( 'magic_book_OBJ.mtl', function ( materials ) {

    materials.preload();
    console.log("masuk")

    new OBJLoader()
      .setMaterials( materials )
      .setPath( 'resources/' )
      .load( 'magic_book_OBJ.obj', function ( object ) {

        scene.add( object );

      }, onProgress );

  } );


const kirby = new Kirby(scene);
const input = new Input();



var time_prev = 0
function animate(time) {
	var dt = time - time_prev
    dt*=0.1;

    
	renderer.render( scene, camera );

  kirby.run(dt, input.keyPressed);

    time_prev = time;
    requestAnimationFrame( animate );
    
}
requestAnimationFrame( animate );