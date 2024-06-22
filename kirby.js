import * as THREE from 'three';
import { FBXLoader } from "three/examples/jsm/Addons.js";

class Character {
    constructor(scene) {
        this.loader = new FBXLoader();
        this.onProgress = function (xhr) {
            if (xhr.lengthComputable) {
                let percentComplete = xhr.loaded / xhr.total * 100;
                // console.log(percentComplete.toFixed(2) + '% downloaded');
            }
        };

        this.object = undefined;
        this.collisionBox = undefined;
        this.mixer = undefined;
        this.actions = {};
        this.currentState = '';
    }

    run(dt, keyPressed) {
        this.mixer && this.mixer.update(dt);
    }

    loadObjectFBX(scene, url) {
        this.loader.load(url, (object) => {
            this.mixer = new THREE.AnimationMixer(object);
            object.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            scene.add(object);
            this.object = object;
        }, this.onProgress);
    }

    loadAnimationFBX(state, url, index = 0) {
        if (typeof this.mixer !== "undefined") {
            this.loader.load(url, (object) => {
                const action = this.mixer.clipAction(object.animations[index]);
                action.clampWhenFinished = true;
                action.play();
                this.actions[state] = action;
                this.setWeight(state, 0);
            }, this.onProgress);
        }
        else setTimeout(() => { this.loadAnimationFBX(state, url) }, 250);
    }

    setInitState(state) {
        if (typeof this.actions[state] !== "undefined") {
            this.currentState = state;
            this.setWeight(state, 1);
        }
        else setTimeout(() => { this.setInitState(state) }, 250);
    }

    crossFade(startAction, endAction, duration) {
        if (startAction == endAction) return;
        if (!this.actions[startAction] || !this.actions[endAction]) return;

        this.currentState = endAction;
        this.setWeight(endAction, 1);
        this.actions[endAction].time = 0;
        this.actions[startAction].crossFadeTo(this.actions[endAction], duration, true);
    }

    setWeight(state, weight) {
        this.actions[state].enabled = true;
        this.actions[state].setEffectiveTimeScale(1);
        this.actions[state].setEffectiveWeight(weight);
    }
}

export class Kirby extends Character {
    constructor(scene) {
        super();
        this.v = 0;
        this.angle = 0;
        this.playerSpeed = 2;

        this.loadObjectFBX(scene, './assets/kirby_Animated2.fbx');
        this.loadAnimationFBX('Idle', './assets/kirby_Animated2.fbx', 0);
        this.loadAnimationFBX('Running', './assets/kirby_Animated2.fbx', 1);
        this.loadAnimationFBX('Walking', './assets/kirby_Animated2.fbx', 2);
        this.setInitState('Idle');
    }

    run(dt, keyPressed) {
        super.run(dt, keyPressed);
        this.object && this.object.rotation.set(0, this.angle, 0);
        this.object && this.object.position.add(new THREE.Vector3(this.playerSpeed * this.v * Math.sin(this.angle), 0, this.playerSpeed * this.v * Math.cos(this.angle)));
        this.collisionBox = new THREE.Box3().setFromPoints([
            new THREE.Vector3(this.object.position.x - 50, this.object.position.y - 1, this.object.position.z - 50),
            new THREE.Vector3(this.object.position.x + 50, this.object.position.y + 1, this.object.position.z + 50),
        ]);

        if (this.v == 0) this.crossFade(this.currentState, 'Idle', 0.1);
        else if (this.playerSpeed == 2) this.crossFade(this.currentState, 'Walking', 0.1);
        else this.crossFade(this.currentState, 'Running', 0.1);

        if (keyPressed['w']) {
            this.v = 1;
        } else {
            this.v = 0;
        }
        if (keyPressed['a']) {
            this.angle += 3 * Math.PI / 180;
        }
        if (keyPressed['d']) {
            this.angle -= 3 * Math.PI / 180;
        }
        if (keyPressed[' ']) {
            this.playerSpeed = 6;
        } else {
            this.playerSpeed = 2;
        }
    }
}
