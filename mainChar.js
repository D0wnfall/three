import * as THREE from 'three';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';

export class Character{
    constructor(camera,controller, scene, speed){
        this.camera = camera;
        this.controller = controller;
        this.scene = scene;
        this.speed = speed;
        this.rotationVector = new THREE.Vector3();

        this.state = 'idle';
        this.animations = {};
        
        this.camera.setup(new THREE.Vector3(0, 0, 0),this.rotationVector);
        // this.Character.setup(new THREE.Vector3(0, 0, 0), this.rotationVector);
        this.loadModel();
    }

    loadModel(path){
        var loader = new FBXLoader();
        loader.setPath('./resources/Models/');
        loader.load('Sword And Shield Idle.fbx', (fbx) => {
            fbx.scale.setScalar(0.01);
            fbx.rotateY(Math.PI);
            fbx.position.set(0,0,10);
            fbx.traverse(c => {
                c.castShadow = true;
                c.receiveShadow = true;
            });
            this.mesh = fbx;
            this.scene.add(this.mesh);
            this.rotationVector.y = Math.PI/2   ;

            this.mixer = new THREE.AnimationMixer(this.mesh);
            var onLoad =(animName, anim) => {
                var clip = anim.animations[0];
                var action = this.mixer.clipAction(clip);
                this.animations[animName] = {
                    clip:clip,
                    action:action
                };
            };   
            var loader = new FBXLoader();
            loader.setPath('./resources/Models/');
            loader.load('Sword And Shield Idle.fbx', (fbx) => {onLoad('idle', fbx)});
            loader.load('Sword And Shield Walk.fbx', (fbx) => {onLoad('start', fbx)});
        });
    }
    update(dt){
        if (!this.mesh) return;
        var direction = new THREE.Vector3(0,0,0);
        if (this.controller.keys['left']){
            direction.z = -5;   
            this.rotationVector.y += 0.01;
            this.mesh.rotation.y += -0.01;
        }if (this.controller.keys['right']){
            direction.z = 5;
            this.rotationVector.y -= 0.01;
            this.mesh.rotation.y += 0.01;
        }if (this.controller.keys['up']){
            direction.x = 5;
        }if (this.controller.keys['down']){
            direction.x = -5;
        }
        // direction.x = 1;
        if(direction.length()== 0){
            if(this.animations['idle']){
                if(this.state != 'idle'){
                    this.mixer.stopAllAction();
                    this.state = 'idle';
                }
                this.mixer.clipAction(this.animations['idle'].clip).play();
                this.mixer.update(dt);
            }
        }else{
            if(this.animations['start']){
                if(this.state != 'start'){
                    this.mixer.stopAllAction();
                    this.state = 'start';
                }
                this.mixer.clipAction(this.animations['start'].clip).play();
                this.mixer.update(dt);
            }
        }
        var fowardVector = new THREE.Vector3(1,0,0);
        var rightVector = new THREE.Vector3(0,0,1);
        fowardVector.applyAxisAngle(new THREE.Vector3(0,1,0), this.rotationVector.y);
        rightVector.applyAxisAngle(new THREE.Vector3(0,1,0), this.rotationVector.y);

        this.mesh.position.add(fowardVector.multiplyScalar(direction.x * this.speed * dt));
        this.mesh.position.add(rightVector.multiplyScalar(direction.z * this.speed * dt));

        // this.mesh.rotation.y = -(this.rotationVector.y);
        this.camera.setup(this.mesh.position, this.rotationVector);
    }
}


export class CharacterController{
    constructor(){
        this.keys = {
            "left": false,
            "right": false,
            "up": false,
            "down": false
        };

        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
    }

    onKeyDown(event){
        switch(event.key){
            case 'a':
            case 'A':
                this.keys.left = true;
                break;
            case 'd':
            case 'D':
                this.keys.right = true;
                break;
            case 'w':
            case 'W':
                this.keys.up = true;
                break;
            case 's':
            case 'S':
                this.keys.down = true;
                break;
        }
    }
    onKeyUp(event){
        switch(event.key){
            case 'a':
            case 'A':
                this.keys.left = false;
                break;
            case 'd':
            case 'D':
                this.keys.right = false;
                break;
            case 'w':
            case 'W':
                this.keys.up = false;
                break;
            case 's':
            case 'S':
                this.keys.down = false;
                break;
        }
    }
}

export class ThirdPersonCamera{
    constructor(camera, positionOffset, targetOffset){
        this.camera = camera;
        // this.positionOffset = new THREE.Vector3(0, 2, 5);
        // this.targetOffset = new THREE.Vector3(0, 1, 0);
        this.positionOffset = positionOffset;
        this.targetOffset = targetOffset;
    }
    setup(target, angle){
        var temp = new THREE.Vector3();
        temp.copy(this.positionOffset);
        temp.applyAxisAngle(new THREE.Vector3(0,1,0), angle.y);
        temp.applyAxisAngle(new THREE.Vector3(0,0,1), angle.z);

        temp.addVectors(target, temp);
        this.camera.position.copy(temp);


        temp = new THREE.Vector3();
        temp.addVectors(target, this.targetOffset);
        this.camera.lookAt(temp);

        // this.camera.rotation.y = angle.y;
    }
}