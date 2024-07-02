import * as THREE from 'three';
import {Character,CharacterController, ThirdPersonCamera} from './mainChar.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


class Main {
    static init() {
        var canvasReference = document.getElementById("canvas");
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: canvasReference});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000fff,1);
        this.renderer.shadowMap.enabled = true;


        //plane
        const loader = new GLTFLoader().setPath('resources/Models/').load('Scene.gltf', (gltf) => {
            gltf.scene.scale.setScalar(1);
            gltf.scene.position.set(0,0,0);
            gltf.scene.shadowMap = true;
            gltf.scene.castShadow = true;
            gltf.scene.receiveShadow = true;
            this.scene.add(gltf.scene);
        });

        var plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100,100,10,10),
            new THREE.MeshStandardMaterial({color:0x808080})
        );
        this.scene.add(plane);
        plane.rotation.x = -Math.PI/2;
        plane.receiveShadow = true;
        plane.castShadow = true;

        //lampu dinding
        var pointLight = new THREE.PointLight(0xffc000, 3);
        pointLight.position.set(2,3,11);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        pointLight = new THREE.PointLight(0xffc000, 3);
        pointLight.position.set(5,3,-6);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        pointLight = new THREE.PointLight(0xffc000, 3);
        pointLight.position.set(-6,3,-6);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        pointLight = new THREE.PointLight(0xffc000, 3);
        pointLight.position.set(2,3,21);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        pointLight = new THREE.PointLight(0xffc000, 3);
        pointLight.position.set(-6,3,11);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        pointLight = new THREE.PointLight(0xffc000, 3);
        pointLight.position.set(-10,3,19);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        //lilin
        var lilin = new THREE.PointLight(0xffc000, 0.1);
        lilin.position.set(4.9,2,-0.7);
        lilin.castShadow = true;
        this.scene.add(lilin);

        var pointLightHelper = new THREE.PointLightHelper(lilin, 1);
        this.scene.add(pointLightHelper);

        var spotLight = new THREE.SpotLight(0xffc000, 10, 100, Math.PI);
        spotLight.position.set(0,5,0);
        spotLight.castShadow = true;
        this.scene.add(spotLight);

        var spotLightHelper = new THREE.SpotLightHelper(spotLight, 1);
        this.scene.add(spotLightHelper);

        this.Character = new Character(
            new ThirdPersonCamera(
                this.camera, new THREE.Vector3(-5,5,0), new THREE.Vector3(0,0,0)),
            new CharacterController,
            this.scene,
            1
        )
    }

    static render(dt){
        this.Character.update(dt);
        this.renderer.render(this.scene, this.camera);
    }
}
var clock = new THREE.Clock();
Main.init();
requestAnimationFrame(animate); 
function animate(){
    Main.render(clock.getDelta());
    requestAnimationFrame(animate); 
}