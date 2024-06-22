import * as THREE from 'three'

import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'


let mixer = THREE.AnimationMixer
    let modelReady = false
    const animationActions = THREE.AnimationAction
    let activeAction = THREE.AnimationAction
    let lastAction = THREE.AnimationAction
    const fbxLoader = new FBXLoader()

fbxLoader.load(
        (object) => {
            'path/to/your/model.fbx',
            object.scale.set(0.01, 0.01, 0.01)
            mixer = new THREE.AnimationMixer(object)
    
            const animationAction = mixer.clipAction(animations[0])
            animationActions.push(animationAction)
            animationsFolder.add(animations, 'default')
            activeAction = animationActions[0]  // sets current animation
    
            scene.add(object)  // adds animated object to your scene
    
            //add an animation from another file
            fbxLoader.load(
                'path/to/animation.fbx',
                (object) => {
                    console.log('loaded animation')
    
                    const animationAction = mixer.clipAction(animations[0])
                    animationActions.push(animationAction)
                    animationsFolder.add(animations, 'animationName')
    
                    //add an animation from another file
                    fbxLoader.load(
                        'path/to/other/animation.fbx',
                        (object) => {
                            console.log('loaded second animation')
                            const animationAction = mixer.clipAction(animations[0])
                            animationActions.push(animationAction)
                            animationsFolder.add(animations, 'animationName')
    
                            //add an animation from another file
                            fbxLoader.load(
                                'path/to/animation.fbx',
                                (object) => {
                                    console.log('loaded third animation');
                                    const animationAction = mixer.clipAction(animations[0])
                                    animationActions.push(animationAction)
                                    animationsFolder.add(animations, 'animationName')
    
                                    modelReady = true
                                },
                                (xhr) => {
                                    console.log(
                                        (xhr.loaded / xhr.total) * 100 + '% loaded'
                                    )
                                },
                                (error) => {
                                    console.log(error)
                                }
                            )
                        },
                        (xhr) => {
                            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                        },
                        (error) => {
                            console.log(error)
                        }
                    )
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                },
                (error) => {
                    console.log(error)
                }
            )
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        },
        (error) => {
            console.log(error)
        }
    )

const animations = {
       default: function() {
            setAction(animationActions[0])
        },
     firstAnimation:    function () {
            setAction(animationActions[1])
        },
        sceondAnimation:    function () {
            setAction(animationActions[2])
        },
       thirdAnimation:   function () {
            setAction(animationActions[3])
        }
    }
    
    function setAction (toAction){
        if (toAction != activeAction) {
            lastAction = activeAction
            activeAction = toAction
            //lastAction.stop()
            lastAction.fadeOut(1)
            activeAction.reset()
            activeAction.fadeIn(1)
            activeAction.play()
        }
    }

const clock = new THREE.Clock()
    
    function animate() {
        requestAnimationFrame(animate)
    
        controls.update()
    
        if (modelReady) {mixer.update(clock.getDelta())}
    
        render()
    
    }
    
    function render() {
        renderer.render(scene, camera)
    }
    
    animate()