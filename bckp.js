import * as THREE from "three"
import {OrbitControls} from "three/addons/controls/OrbitControls.js"
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { Sky } from 'three/addons/objects/Sky.js';
import { MD2CharacterComplex } from 'three/addons/misc/MD2CharacterComplex.js';
import { Kirby } from './kirby';
import { Input } from './input';


//setup canvas Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.append(renderer.domElement);

//setup Scene and Camera
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xbfd1e5 );


const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(0,0,5);
camera.lookAt(0,0,0);

function initSky() {
    // Add Sky
     var sky = new Sky();
    sky.scale.setScalar( 450000 );
    scene.add( sky );

    var sun = new THREE.Vector3();

    /// GUI

    const effectController = {
        turbidity: 10,
        rayleigh: 3,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.7,
        elevation: 2,
        azimuth: 180,
        exposure: renderer.toneMappingExposure
    };

    function guiChanged() {

        const uniforms = sky.material.uniforms;
        uniforms[ 'turbidity' ].value = effectController.turbidity;
        uniforms[ 'rayleigh' ].value = effectController.rayleigh;
        uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
        uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

        const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
        const theta = THREE.MathUtils.degToRad( effectController.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );

        uniforms[ 'sunPosition' ].value.copy( sun );

        renderer.toneMappingExposure = effectController.exposure;
        renderer.render( scene, camera );

    }

    guiChanged();

}
initSky();

const control = new OrbitControls(camera, renderer.domElement);
control.target.set(0,0,0);
control.update();

//Sun
var geometry = new THREE.SphereGeometry(1,10,10);
var material = new THREE.MeshPhongMaterial({color: 0xFFFF11});
var sun = new THREE.Mesh(geometry, material);
sun.position.y += 1;
sun.receiveShadow = true;
sun.castShadow = true;
scene.add(sun);

//Earth
var earthGeo = new THREE.SphereGeometry(1,10,10);
var earthMat = new THREE.MeshPhongMaterial({color: 0x1111FF});
var earth = new THREE.Mesh(earthGeo, earthMat);
sun.add(earth);
earth.position.set(5,0,0);
earth.scale.set(0.8,0.8,0.8);

//Moon
var moonGeo = new THREE.SphereGeometry(1,10,10);
var moonMat = new THREE.MeshPhongMaterial({color: 0x555555});
var moon = new THREE.Mesh(moonGeo, moonMat);
earth.add(moon);
moon.position.set(3,0,0);
moon.scale.set(0.5,0.5,0.5);
earth.rotation.x += 45;

const planeSize = 40;
var planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
var planeMat = new THREE.MeshPhongMaterial({
    color: 0x888888,
    side: THREE.DoubleSide,
});

var mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -.5;
mesh.receiveShadow = true;
scene.add(mesh);

//Load OBJ
new MTLLoader()
    .setPath( 'resources/Satellite/Satellite/' )
    .load( 'Satelite.mtl', function ( materials ) {

        materials.preload();

        new OBJLoader()
            .setMaterials( materials )
            .setPath( 'resources/Satellite/Satellite/' )
            .load( 'Satelite.obj', function ( object ) {

                earth.add( object );
                object.position.set(-2,0,0);
                object.scale.set(0.05,0.05,0.05);

            });

    } );

const kirby = new Kirby(scene);
const input = new Input();

//Load FBX
// var mixer;
// const loader = new FBXLoader();
// loader.load( 'resources/Falling.fbx', function ( object ) {

//     mixer = new THREE.AnimationMixer( object );

//     const action = mixer.clipAction( object.animations[ 0 ] );
//     action.play();

//     object.traverse( function ( child ) {

//         if ( child.isMesh ) {

//             child.castShadow = true;
//             child.receiveShadow = true;

//         }

//     } );

//     object.scale.set(0.01, 0.01, 0.01);
//     object.rotation.set(0,3.14,0);
//     object.position.set(0,0,5);
//     sun.add( object );

// } );

//Load FBX
var mixer2;
const loader2 = new FBXLoader();
loader2.load( 'resources/wolf.FBX', function ( object ) {

    mixer2 = new THREE.AnimationMixer( object );

    const action = mixer2.clipAction( object.animations[ 0 ] );
    action.play();

    object.traverse( function ( child ) {

        if ( child.isMesh ) {

            child.castShadow = true;
            child.receiveShadow = true;

        }

    } );

    object.scale.set(0.01, 0.01, 0.01);
    object.rotation.set(0,3.14,0);
    object.position.set(5,0,0);
    // sun.add( object );
    scene.add(object);

} );

//Ambient Light
// var ambientLight = new THREE.AmbientLight(0xFF8888, 2);
// scene.add(ambientLight);

//Hemisphere Light
var hemisphereLight = new THREE.HemisphereLight(0xB1E1FF, 0xB97A20, 0.5);
scene.add(hemisphereLight);

//Directional Light
var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
directionalLight.castShadow = true;
directionalLight.position.set(5,5,0);
directionalLight.target.position.set(0,0,0);
scene.add(directionalLight);
scene.add(directionalLight.target);
var directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(directionalLightHelper);

// //Point Light
// var pointLight = new THREE.PointLight(0xFFFF11, 50, 1000);
// sun.add(pointLight);

// //Spot Light
// var spotLight = new THREE.SpotLight(0xFF1111, 150, 10000, 3, 0.3);
// moon.add(spotLight);
// earth.add(spotLight.target);
// var spotLightHelper = new THREE.SpotLightHelper(spotLight);
// // spotLight.add(spotLightHelper);

var clock = new THREE.Clock();

//loop animation

var time_prev = 0
function animate(time) {
	var dt = time - time_prev
    dt*=0.1;

    
	renderer.render( scene, camera );

if(kirby.object)  kirby.run(dt, input.keyPressed);

    time_prev = time;
    requestAnimationFrame( animate );
    
}
requestAnimationFrame( animate );