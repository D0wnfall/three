import * as THREE from 'three';
import {FBXLoader} from 'three/addons/loaders/FBXLoader.js';

export class Character{
    constructor(camera,controller, scene, speed){
        this.camera = camera;
        this.controller = controller;
        this.scene = scene;
        this.speed = speed;
        this.rotationVector = new THREE.Vector3();
        this.cameraRotationVector = new THREE.Vector3();
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
            this.rotationVector.y = Math.PI/2;

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
            direction.z = -2;   
            this.rotationVector.y += 0.05;
            this.mesh.rotation.y += -0.05;
        }if (this.controller.keys['right']){
            direction.z = 2;
            this.rotationVector.y += -0.05;
            this.mesh.rotation.y += 0.05;
        }if (this.controller.keys['up']){
            direction.x = 2;
        }if (this.controller.keys['down']){
            direction.x = -2;
        }

        if (this.controller.keys['pitchup']) {
            this.cameraRotationVector.x += 0.05 ;
            this.camera.pitch += 0.05;
        }
        if (this.controller.keys['pitchdown']) {
            this.cameraRotationVector.x += -0.05 ;
            this.camera.pitch -= 0.05 ;
        }

        if (this.controller.keys['yawleft']) {
            this.rotationVector.y += 0.05 ;
            this.mesh.rotation.y += -0.05 ;
        }
        if (this.controller.keys['yawright']) {
            this.rotationVector.y += -0.05 ;
            this.mesh.rotation.y += 0.05 ;
        }

        if (this.controller.keys['1']) {
            this.cameraMode = 'firstPerson';
        } else if (this.controller.keys['2']) {
            this.cameraMode = 'thirdPerson';
        }

        if (this.cameraMode === 'firstPerson') {
            this.camera.setup(this.mesh.position, this.firstPersonOffset);
        } else if (this.cameraMode === 'thirdPerson') {
            this.camera.setup(this.mesh.position, this.thirdPersonOffset);
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

        // this.camera.rotation.x = this.cameraRotationVector.x;
        this.camera.setup(this.mesh.position, this.rotationVector);
    }
}


export class CharacterController{
    constructor(camera){
        this.camera = camera;
        this.keys = {
            "left": false,
            "right": false,
            "up": false,
            "down": false,
            "pitchup": false,
            "pitchdown": false,
            "yawleft": false,
            "yawright": false,
            '1': false,
            '2': false,
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
            case 'f':
            case 'F':
                this.keys.pitchup = true;
                break;
            case 'g':
            case 'G':
                this.keys.pitchdown = true;
                break;
            case 'q':
            case 'Q':
                this.keys.yawleft = true;
                break;
            case 'e':
            case 'E':
                this.keys.yawright = true;
                break;
            case '1':
                this.keys['1'] = true;
                break;
            case '2':
                this.keys['2'] = true;
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
            case 'f':
            case 'F':
                this.keys.pitchup = false;
                break;
            case 'g':
            case 'G':
                this.keys.pitchdown = false;
                break;
            case 'q':
            case 'Q':
                this.keys.yawleft = false;
                break;
            case 'e':
            case 'E':
                this.keys.yawright = false;
                break;
            case '1':
                this.keys['1'] = false;
                break;
            case '2':
                this.keys['2'] = false;
                break;
        }
    }
}

export class ThirdPersonCamera{
    constructor(camera, positionOffset, targetOffset){
        this.camera = camera;
        this.positionOffset = positionOffset;
        this.targetOffset = targetOffset;
    }
    setup(target, angle){
        var temp = new THREE.Vector3();
        temp.copy(this.positionOffset);
        temp.applyAxisAngle(new THREE.Vector3(1,0,0), angle.x);
        temp.applyAxisAngle(new THREE.Vector3(0,1,0), angle.y);
        temp.applyAxisAngle(new THREE.Vector3(0,0,1), angle.z);

        temp.addVectors(target, temp);
        this.camera.position.copy(temp);

        temp = new THREE.Vector3();
        temp.addVectors(target, this.targetOffset);
        this.camera.lookAt(temp);
    }
}

export class FirstPersonCamera {
    constructor(camera, targetOffset) {
        this.camera = camera;
        this.targetOffset = targetOffset;
    }

    setup(target, angle) {
        var temp = new THREE.Vector3();
        temp.copy(this.targetOffset);
        temp.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle.y);
        temp.addVectors(target, temp);
        this.camera.position.copy(temp);

        temp = new THREE.Vector3();
        temp.addVectors(target, new THREE.Vector3(0, 0, -1)); // Offset for head height
        this.camera.lookAt(temp);
    }
}

export class FreeRoamCamera {
    constructor(camera) {
        this.camera = camera;
        this.moveSpeed = 5;
        this.rotationSpeed = 1;
        this.keys = {
            "forward": false,
            "backward": false,
            "left": false,
            "right": false,
            "up": false,
            "down": false,
            "pitchUp": false,
            "pitchDown": false,
            "yawLeft": false,
            "yawRight": false,
            "rollLeft": false,
            "rollRight": false
        };

        document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this.onKeyUp(e), false);
    }
       onKeyDown(event) {
        switch (event.key) {
            case 'i':
            case 'I':
                this.keys.forward = true;
                break;
            case 'k':
            case 'K':
                this.keys.backward = true;
                break;
            case 'j':
            case 'J':
                this.keys.left = true;
                break;
            case 'l':
            case 'L':
                this.keys.right = true;
                break;
            case 'q':
                this.keys.rollLeft = true;
                break;
            case 'e':
                this.keys.rollRight = true;
                break;
            case 'r':
                this.keys.up = true;
                break;
            case 'f':
                this.keys.down = true;
                break;
            case 'ArrowUp':
                this.keys.pitchUp = true;
                break;
            case 'ArrowDown':
                this.keys.pitchDown = true;
                break;
            case 'ArrowRight':
                this.keys.yawLeft = true;
                break;
            case 'ArrowLeft':
                this.keys.yawRight = true;
                break;
        }
    }

    onKeyUp(event) {
        switch (event.key) {
            case 'i':
            case 'I':
                this.keys.forward = false;
                break;
            case 'k':
            case 'K':
                this.keys.backward = false;
                break;
            case 'j':
            case 'J':
                this.keys.left = false;
                break;
            case 'l':
            case 'L':
                this.keys.right = false;
                break;
            case 'q':
                this.keys.rollLeft = false;
                break;
            case 'e':
                this.keys.rollRight = false;
                break;
            case 'r':
                this.keys.up = false;
                break;
            case 'f':
                this.keys.down = false;
                break;
            case 'ArrowUp':
                this.keys.pitchUp = false;
                break;
            case 'ArrowDown':
                this.keys.pitchDown = false;
                break;
            case 'ArrowRight':
                this.keys.yawLeft = false;
                break;
            case 'ArrowLeft':
                this.keys.yawRight = false;
                break;
        }
    }
    setup(target, angle){
        
    }
    update(dt) {
        var moveSpeed = this.moveSpeed * dt;
        var rotationSpeed = this.rotationSpeed * dt;

        if (this.keys.forward) {
            this.camera.translateZ(-moveSpeed);
        }
        if (this.keys.backward) {
            this.camera.translateZ(moveSpeed);
        }
        if (this.keys.left) {
            this.camera.translateX(-moveSpeed);
        }
        if (this.keys.right) {
            this.camera.translateX(moveSpeed);
        }
        if (this.keys.up) {
            this.camera.translateY(moveSpeed);
        }
        if (this.keys.down) {
            this.camera.translateY(-moveSpeed);
        }
        if (this.keys.pitchUp) {
            this.camera.rotation.x -= rotationSpeed;
        }
        if (this.keys.pitchDown) {
            this.camera.rotation.x += rotationSpeed;
        }
        if (this.keys.yawLeft) {
            this.camera.rotation.y -= rotationSpeed;
        }
        if (this.keys.yawRight) {
            this.camera.rotation.y += rotationSpeed;
        }
        if (this.keys.rollLeft) {
            this.camera.rotation.z -= rotationSpeed;
        }
        if (this.keys.rollRight) {
            this.camera.rotation.z += rotationSpeed;
        }
    }
}

