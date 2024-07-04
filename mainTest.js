import * as THREE from 'three';
import {Character,CharacterController, ThirdPersonCamera, FirstPersonCamera, FreeRoamCamera} from './mainChar.js';
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
            canvas: canvasReference});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x0f0f0f,1);
        this.renderer.shadowMap.enabled = true;
        //glass
        const glassMaterial = new THREE.MeshPhysicalMaterial();
        glassMaterial.color = new THREE.Color(1,1,1);
        glassMaterial.transmission = 1.0;
        glassMaterial.roughness = 0.0;
        glassMaterial.ior = 1.7;
        glassMaterial.thickness = 0.5;

        var sphere = new THREE.Mesh(new THREE.SphereGeometry(1,64,64),glassMaterial);
        sphere.position.z = 0;
        sphere.position.x = 0;
        sphere.position.y = 1;
        sphere.castShadow = true;
        this.scene.add(sphere)
        
        //cube collision
        var cube = new THREE.Mesh(new THREE.BoxGeometry(6,2,5), new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 }));
        cube.position.z = 2;
        cube.position.x = 5;
        cube.position.y = 0.5;
        this.scene.add(cube);

        cube = new THREE.Mesh(new THREE.BoxGeometry(2,2,13), new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 }));
        cube.position.z = -2;
        cube.position.x = 5;
        cube.position.y = 0.5;
        this.scene.add(cube);

        cube = new THREE.Mesh(new THREE.BoxGeometry(8,2,5), new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 }));
        cube.position.z = 2;
        cube.position.x = -6;
        cube.position.y = 0.5;
        this.scene.add(cube);

        cube = new THREE.Mesh(new THREE.BoxGeometry(2,2,13), new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 }));
        cube.position.z = -2;
        cube.position.x = -9.5;
        cube.position.y = 0.5;
        this.scene.add(cube);

        cube = new THREE.Mesh(new THREE.BoxGeometry(3,2,3), new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 }));
        cube.position.z = -5;
        cube.position.x = 0;
        cube.position.y = 0.5;
        this.scene.add(cube);

        cube = new THREE.Mesh(new THREE.BoxGeometry(1.5,2,8), new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 }));
        cube.position.z = 8.25;
        cube.position.x = -10.2;
        cube.position.y = 0.5;
        this.scene.add(cube);

        cube = new THREE.Mesh(new THREE.BoxGeometry(0.3,2,0.3), new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 }));
        cube.position.z = 12;
        cube.position.x = -2;
        cube.position.y = 0.5;
        this.scene.add(cube);
        
        cube = new THREE.Mesh(new THREE.BoxGeometry(0.3,2,0.3), new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 }));
        cube.position.z = 12;
        cube.position.x = -6;
        cube.position.y = 0.5;
        this.scene.add(cube);

        cube = new THREE.Mesh(new THREE.BoxGeometry(7.5,2,15), new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 }));
        cube.position.z = 13;
        cube.position.x = 6;
        cube.position.y = 0.5;
        this.scene.add(cube);

        cube = new THREE.Mesh(new THREE.BoxGeometry(20,2,1), new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 }));
        cube.position.z = 24;
        cube.position.x = -3;
        cube.position.y = 0.5;
        this.scene.add(cube);

        cube = new THREE.Mesh(new THREE.BoxGeometry(1,2,10), new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 }));
        cube.position.z = 20;
        cube.position.x = -6;
        cube.position.y = 0.5;
        this.scene.add(cube);

        cube = new THREE.Mesh(new THREE.BoxGeometry(0.3,2,0.3), new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 }));
        cube.position.z = 20;
        cube.position.x = -2;
        cube.position.y = 0.5;
        this.scene.add(cube);

        cube = new THREE.Mesh(new THREE.BoxGeometry(5,2,4), new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 }));
        cube.position.z = 21;
        cube.position.x = -12;
        cube.position.y = 0.5;
        this.scene.add(cube);

        cube = new THREE.Mesh(new THREE.BoxGeometry(1,2,30), new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 }));
        cube.position.z = 10;
        cube.position.x = -14;
        cube.position.y = 0.5;
        this.scene.add(cube);

        cube= new THREE.Mesh(new THREE.BoxGeometry(5,2,4), new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 }));
        cube.position.z = 21;
        cube.position.x = -12;
        cube.position.y = 0.5;
        this.scene.add(cube);

        cube= new THREE.Mesh(new THREE.BoxGeometry(5,2,4), new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.0 }));
        cube.position.z = -5;
        cube.position.x = -12;
        cube.position.y = 0.5;
        this.scene.add(cube);


        //plane
        const loader = new GLTFLoader().setPath('resources/Models/').load('Scene.gltf', (gltf) => {
            gltf.scene.traverse((object) => {
                if (object.isMesh) {
                  object.castShadow = true;
                  object.receiveShadow = true;
                }
              });
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
        
        // var geometry = new THREE.CircleGeometry( 2,4 );
        // var groundMirror = new Reflector( geometry, {
        //     clipBias: 0.003,
        //     textureWidth: window.innerWidth * window.devicePixelRatio ,
        //     textureHeight: window.innerHeight * window.devicePixelRatio ,
        //     color: 0xb5b5b5
        // } );
        // groundMirror.position.y = 0.5;
        // groundMirror.rotateX( - Math.PI / 2 );
        // this.scene.add( groundMirror );

        // geometry = new THREE.PlaneGeometry( 2, 4 );
        // var verticalMirror = new Reflector( geometry, {
        //     clipBias: 0.003,
        //     textureWidth: window.innerWidth  * window.devicePixelRatio ,
        //     textureHeight: window.innerHeight  * window.devicePixelRatio ,
        //     color: 0xc1cbcb
        // } );
        // verticalMirror.position.y = 50;
        // verticalMirror.position.z = - 50;
        // this.scene.add( verticalMirror );

        //lampu dinding
        var pointLight = new THREE.PointLight(0xffc000, 5);
        pointLight.position.set(5,3,-6);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        pointLight = new THREE.PointLight(0xffc000, 5);
        pointLight.position.set(-6,3,-6);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        pointLight = new THREE.PointLight(0xffc000, 5);
        pointLight.position.set(2,3,21);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        pointLight = new THREE.PointLight(0xffc000, 5);
        pointLight.position.set(-6,3,11);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        pointLight = new THREE.PointLight(0xffc000, 5);
        pointLight.position.set(-10,3,19);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        pointLight = new THREE.PointLight(0xffc000, 5);
        pointLight.position.set(-5,3,20);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        pointLight = new THREE.PointLight(0xffc000, 5);
        pointLight.position.set(-14,3,0.7);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        pointLight = new THREE.PointLight(0xffc000, 5);
        pointLight.position.set(3,3,16);
        pointLight.castShadow = true;
        this.scene.add(pointLight);

        //lilin
        var lilin = new THREE.PointLight(0xffc000, 2);
        lilin.position.set(5.27,1.25,11.20);
        lilin.castShadow = true;
        this.scene.add(lilin);

        //lentera
        var lentera = new THREE.PointLight(0xffc000, 4);
        lentera.position.set(-2,1.25,0);
        lentera.castShadow = true;
        this.scene.add(lentera);

        var lentera = new THREE.PointLight(0xffc000, 4);
        lentera.position.set(2,1.25,0);
        lentera.castShadow = true;
        this.scene.add(lentera);


        // reflector
        // window.addEventListener( 'resize', onWindowResize );
        //event listener
        window.addEventListener('wheel', this.onMouseWheel.bind(this), false);
        window.addEventListener('keydown', this.onKeyDown.bind(this), false);

        //camera
        this.firstPersonCamera = new FirstPersonCamera(
            this.camera, new THREE.Vector3(-3,2,0), new THREE.Vector3(0,0,0)
        );
        this.thirdPersonCamera = new ThirdPersonCamera(
            this.camera, new THREE.Vector3(-5,5,0), new THREE.Vector3(0,0,0)
        );
        this.freeRoamCamera = new FreeRoamCamera(this.camera,100); // Speed set to 5 for FreeRoamCamera

        this.currentCamera = this.thirdPersonCamera;

        this.Character = new Character(
            new ThirdPersonCamera(
                this.camera, new THREE.Vector3(-5,5,0), new THREE.Vector3(0,0,0)),
            new CharacterController,
            this.scene,
            1
        );
        
    }



    // loadModel(path){
    //     var loaderNPC = new FBXLoader();
    //     loaderNPC.setPath('./resources/Models/');
    //     loaderNPC.load('Old Man Idle.fbx', (fbx) => {
    //         fbx.scale.setScalar(0.01);
    //         fbx.rotateY(Math.PI);
    //         fbx.position.set(0,0,10);
    //         fbx.traverse(c => {
    //             c.castShadow = true;
    //             c.receiveShadow = true;
    //         });
    //         this.mesh = fbx;
    //         this.scene.add(this.mesh);
    //         this.rotationVector.y = Math.PI/2;

    //         this.mixer = new THREE.AnimationMixer(this.mesh);
    //         var onLoad =(animName, anim) => {
    //             var clip = anim.animations[0];
    //             var action = this.mixer.clipAction(clip);
    //             this.animations[animName] = {
    //                 clip:clip,
    //                 action:action
    //             };
    //         };   
    //         var loaderNPC = new FBXLoader();
    //         loaderNPC.setPath('./resources/Models/');
    //         loaderNPC.load('Old Man Idle.fbx', (fbx) => {onLoad('idle', fbx)});
    //     });  
    // };

    

    static render(dt){
        this.checkBoundaries(dt);
        this.Character.update(dt);
        
        // Update camera if it's a FreeRoamCamera
        if (this.currentCamera instanceof FreeRoamCamera) {
            this.currentCamera.update(dt);
        }

        this.renderer.render(this.scene, this.camera);
    }
    
    static checkBoundaries(dt) {
        if (!this.Character.mesh) return;

        var position = this.Character.mesh.position;
        var speed = this.Character.speed * dt;

        // Define the boundaries
        var halfSize = this.planeSize / 2;
        var minX = -halfSize + speed;
        var maxX = halfSize - speed;
        var minZ = -halfSize + speed;
        var maxZ = halfSize - speed;

        // Adjust the speed based on the boundaries
        if (position.x < minX) {
            this.Character.mesh.position.x = minX;
        } else if (position.x > maxX) {
            this.Character.mesh.position.x = maxX;
        }

        if (position.z < minZ) {
            this.Character.mesh.position.z = minZ;
        } else if (position.z > maxZ) {
            this.Character.mesh.position.z = maxZ;
        }
    }
    
    static onMouseWheel(event) {
        if (event.deltaY > 0) {
            this.camera.position.z = Math.max(1, this.camera.position.z + 1);
            this.camera.position.y = Math.max(1, this.camera.position.y + 1);
        } else {
            this.camera.position.z = Math.min(100, this.camera.position.z - 1);
            this.camera.position.y = Math.max(1, this.camera.position.y - 1);
        }
        this.camera.updateProjectionMatrix();
    }


    static onKeyDown(event) {
        if (event.key === 'c' || event.key === 'C') { // 'c' key to switch camera
            if (this.currentCamera instanceof FirstPersonCamera) {
                this.currentCamera = this.thirdPersonCamera;
            } else if (this.currentCamera instanceof ThirdPersonCamera) {
                this.currentCamera = this.freeRoamCamera;
            } else {
                this.currentCamera = this.firstPersonCamera;
            }
            this.Character.camera = this.currentCamera; // Update Character's camera directly
        }
        if (event.key === ' ') {
            this.Character.startMoving();
        }
    }
}

// function onWindowResize() {
//     groundMirror.getRenderTarget().setSize(
//         window.innerWidth  * window.devicePixelRatio ,
//         window.innerHeight  * window.devicePixelRatio
//     );
//     verticalMirror.getRenderTarget().setSize(
//         window.innerWidth  * window.devicePixelRatio ,
//         window.innerHeight  * window.devicePixelRatio 
//     );

// }
var clock = new THREE.Clock();
Main.init()
requestAnimationFrame(animate); 
function animate(){
    Main.render(clock.getDelta());
    requestAnimationFrame(animate); 
}
