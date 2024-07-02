import * as THREE from 'three';
import { Character, CharacterController, ThirdPersonCamera } from './mainChar.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { Reflector } from 'three/addons/objects/Reflector.js';

class Main {
    static init() {
        var canvasReference = document.getElementById("canvas");
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: canvasReference
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000fff, 1);
        this.renderer.shadowMap.enabled = true;

        //glass
        const glassMaterial = new THREE.MeshPhysicalMaterial();
        glassMaterial.color = new THREE.Color(1, 1, 1);
        glassMaterial.transmission = 1.0;
        glassMaterial.roughness = 0.0;
        glassMaterial.ior = 1.7;
        glassMaterial.thickness = 0.5;

        var sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), glassMaterial);
        sphere.position.z = 0;
        sphere.position.x = 0;
        sphere.position.y = 1;
        sphere.castShadow = true;
        this.scene.add(sphere);

        //plane
        new GLTFLoader().setPath('resources/Models/').load('Scene.gltf', (gltf) => {
            gltf.scene.traverse((object) => {
                if (object.isMesh) {
                    object.castShadow = true;
                    object.receiveShadow = true;
                }
            });
            this.scene.add(gltf.scene);
        });

        var plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100, 10, 10),
            new THREE.MeshStandardMaterial({ color: 0x808080 })
        );
        this.scene.add(plane);
        plane.rotation.x = -Math.PI / 2;
        plane.receiveShadow = true;
        plane.castShadow = true;

        //lampu dinding
        var pointLight = new THREE.PointLight(0xffc000, 5);
        pointLight.position.set(5, 3, -6);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        pointLight = new THREE.PointLight(0xffc000, 5);
        pointLight.position.set(-6, 3, -6);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        pointLight = new THREE.PointLight(0xffc000, 5);
        pointLight.position.set(2, 3, 21);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        pointLight = new THREE.PointLight(0xffc000, 5);
        pointLight.position.set(-6, 3, 11);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        pointLight = new THREE.PointLight(0xffc000, 5);
        pointLight.position.set(-10, 3, 19);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        pointLight = new THREE.PointLight(0xffc000, 5);
        pointLight.position.set(-5, 3, 20);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        pointLight = new THREE.PointLight(0xffc000, 5);
        pointLight.position.set(-14, 3, 0.7);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        pointLight = new THREE.PointLight(0xffc000, 5);
        pointLight.position.set(3, 3, 16);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        //lilin
        var lilin = new THREE.PointLight(0xffc000, 2);
        lilin.position.set(0.225, 1, -4.50);
        lilin.castShadow = true;
        this.scene.add(lilin);

        lilin = new THREE.PointLight(0xffc000, 2);
        lilin.position.set(5.27, 1.25, 11.20);
        lilin.castShadow = true;
        this.scene.add(lilin);

        //lentera
        var lentera = new THREE.PointLight(0xffc000, 4);
        lentera.position.set(-2, 1.25, 0);
        lentera.castShadow = true;
        this.scene.add(lentera);

        lentera = new THREE.PointLight(0xffc000, 4);
        lentera.position.set(2, 1.25, 0);
        lentera.castShadow = true;
        this.scene.add(lentera);

        var pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
        this.scene.add(pointLightHelper);

        this.Character = new Character(
            new ThirdPersonCamera(
                this.camera, new THREE.Vector3(-5, 5, 0), new THREE.Vector3(0, 0, 0)),
            new CharacterController,
            this.scene,
            1
        );

        this.animations = {};  // Add this line to initialize the animations object
        this.loadModel();
    }

    static loadModel() {
        var loaderNPC = new FBXLoader();
        loaderNPC.setPath('./resources/Models/');
        loaderNPC.load('Old Man Idle.fbx', (fbx) => {
            fbx.scale.setScalar(0.01);
            fbx.rotateY(130);
            fbx.position.set(6.9, 0, 10);
            fbx.traverse(c => {
                c.castShadow = true;
                c.receiveShadow = true;
            });
            this.scene.add(fbx);

            this.mixer = new THREE.AnimationMixer(fbx);
            var onLoad = (anim) => {
                var clip = anim.animations[0];
                var action = this.mixer.clipAction(clip);
                action.play();
                this.animations.idle = {
                    clip: clip,
                    action: action
                };
            };
            var animLoader = new FBXLoader();
            animLoader.setPath('./resources/Models/');
            animLoader.load('Old Man Idle.fbx', (fbx) => { onLoad(fbx) });
        });
    }

    static render(dt) {
        // if (this.mixer) {
        //     this.mixer.update(dt);
        // } jalanin pas presentasi saja
        this.Character.update(dt);
        this.renderer.render(this.scene, this.camera);
    }
}

var clock = new THREE.Clock();
Main.init();
requestAnimationFrame(animate);

function animate() {
    Main.render(clock.getDelta());
    requestAnimationFrame(animate);
}
