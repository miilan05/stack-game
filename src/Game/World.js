import * as THREE from 'three'
import Game from './Game'
import * as TWEEN from '@tweenjs/tween.js'
import Background from './Utils/Background'
import Intersections from './Utils/Intersections'
import Effects from './Utils/Effects'
import * as CANNON from 'cannon-es'
import PhysicsUtils from './Utils/PhisicsUtils'
import WorldPhysics from './WorldPhysics'

export default class World {
    constructor(_options) {
        this.game = new Game()
        this.config = this.game.config
        this.setInstance()
        this.addLight()

        document.querySelector('.game').addEventListener('click', ()=>{
            this.onClick()
        })

    }

    setInstance() {
        this.falling = this.config.falling.slice()
        this.falling2 = this.config.falling2.slice()
        this.scene = this.game.scene
        this.instance = new CANNON.World()
        this.instance.gravity.set(0, -10, 0)        
        this.movementAxis = this.config.movementAxis
        this.score = this.config.score
        this.score.innerHTML = 0
        this.currentShape = Object.assign({},this.config.currentShape)
        this.offset = this.config.offset
        this.needsUp = this.config.needsUp
        this.m = this.config.m.slice()
        if (this.config.randomizeColor) {
            this.color = Math.floor(Math.random() * 360);
        }
        else this.color = this.config.color
        this.colorIncrement = this.config.colorIncrement
        this.cubeHeight = this.config.cubeHeight
        this.currentHeight = this.config.currentHeight
        this.lost = this.config.lost

        Background.updateBackground(this.color)
        this.setWorldPhysics()
        this.addStaticMesh()
        this.color += this.colorIncrement
        this.addMesh()
        this.color += this.colorIncrement
        this.move(this.m.at(-1), "x", 3, 1000, this.config.easingFunction)

    }


    addStaticMesh() {
        const texture = new THREE.TextureLoader().load( "./images/1.jpg" );
        const staticGeo = new THREE.BoxGeometry(this.currentShape.x, 2, this.currentShape.y, 1);
        const staticTransparentMaterial = new THREE.MeshStandardMaterial({color: `hsl(${this.color%360}, 100%, 30%)`, alphaMap: texture, transparent: true})
        const cubeMaterials = [
            staticTransparentMaterial,
            staticTransparentMaterial,
            new THREE.MeshStandardMaterial({color: `hsl(${this.color%360}, 100%, 30%)`}),
            staticTransparentMaterial,
            staticTransparentMaterial,
            staticTransparentMaterial
        ];
        const meshStatic = new THREE.Mesh(staticGeo, cubeMaterials);
        meshStatic.position.set(0, -0.5 - this.cubeHeight/2, 0)
        meshStatic.receiveShadow = true
        this.scene.add(meshStatic)
        this.m.push(meshStatic)
        this.instance.addBody(PhysicsUtils.meshToBody(meshStatic, 0, true))
    }

    addMesh() {
        const geometry = new THREE.BoxGeometry(this.currentShape.x, this.currentShape.y, this.cubeHeight);
        const material = new THREE.MeshStandardMaterial({color: `hsl(${this.color%360}, 100%, 40%)`});
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.rotation.x = Math.PI/2;
        mesh.position.set(-1, this.currentHeight, 0) 
        this.scene.add(mesh)
        this.m.push(mesh)
    }

    addLight() {
        const light2 = new THREE.AmbientLight(0xffffff, 0.4);
        const light3 = new THREE.DirectionalLight(0xffffff, 0.6);
        light3.castShadow = true
        light3.position.set(300, 600, -300);
        light3.shadow.camera.position.set(-10, 300, -10)
        light3.shadow.mapSize.width = 1024 * 4
        light3.shadow.mapSize.height = 1024 * 4

        this.scene.add(light2, light3)
    }

    move(mesh, axis, target, duration, easingFunction) {
        const startPosition = { [axis]: mesh.position[axis] };
        const endPosition = { [axis]: target };
      
        if (mesh.tween) {
          mesh.tween.stop();
        }
        mesh.tween = new TWEEN.Tween(startPosition)
          .to(endPosition, duration)
          .easing(TWEEN.Easing[easingFunction[0]][easingFunction[1]])
          .onUpdate(() => {
            mesh.position[axis] = startPosition[axis];
          })
          .onComplete(()=>{
                this.move(mesh, this.movementAxis, -target, 1000, this.config.easingFunction)
          })
          .start();
    }

    onClick() {
        this.m.at(-1).tween.stop()
        this.needsUp+= this.cubeHeight
        let intersect = Intersections.intersects(this.m.at(-1), this.m.at(-2))
        if (this.lost) {this.restart(); this.lost = false;}
        else if (intersect == undefined) {
            this.lost = true
            this.needsUp = 0
            let body = PhysicsUtils.meshToBody(this.m.at(-1), 1, true)
            this.falling.push(this.m.at(-1))
            this.falling2.push(body)
            this.instance.addBody(body)
        }
        else {
            this.score.innerHTML = parseInt(this.score.innerHTML) + 1
            Background.updateBackground(this.color)
            this.cutAndPlace(intersect.insidePiece, false)
            if (intersect.outsidePiece == undefined) {
                Effects.perfectEffect(this.scene, this.m.at(-1).position, this.currentShape.x + 0.2, this.currentShape.y + 0.2)
            }
            else {
                this.cutAndPlace(intersect.outsidePiece, true)
            }
            this.placeNewBlock()
            this.color += this.colorIncrement
        }
    }

    cutAndPlace(i, isFalling) {
        let geometry = new THREE.BoxGeometry(i.right - i.left , i.top - i.bottom, this.cubeHeight)
        let mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial().copy(this.m.at(-1).material))
        mesh.rotation.x = Math.PI/2
        mesh.position.set(i.left + (i.right - i.left)/2, this.currentHeight, i.bottom + (i.top - i.bottom)/2)
        mesh.castShadow = true
        mesh.receiveShadow = true
    
        if (isFalling) {
            let body = PhysicsUtils.meshToBody(mesh, 1, true)
            this.falling.push(mesh)
            this.falling2.push(body)
            this.instance.addBody(body)
        } else {
            this.currentShape.x = i.right - i.left
            this.currentShape.y = i.top - i.bottom
            this.scene.remove(this.m.at(-1))
            this.m.pop()
            this.m.push(mesh)
            this.instance.addBody(PhysicsUtils.meshToBody(mesh, 0, true))
        }
        this.scene.add(mesh)
    }

    placeNewBlock() {
        const geometry = new THREE.BoxGeometry(this.currentShape.x, this.currentShape.y, this.cubeHeight)
        const material = new THREE.MeshStandardMaterial({color: `hsl(${this.color%360}, 100%, 50%)`});
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.rotation.x = Math.PI/2;
        this.m.push(mesh)
        
        if (this.movementAxis == "x") {
            this.movementAxis = "z"
            this.currentHeight += this.cubeHeight
            mesh.position.set(this.m.at(-2).position.x, this.currentHeight, this.m.at(-2).position.z - 2)
        }
        else {
            this.movementAxis = "x"
            this.currentHeight += this.cubeHeight
            mesh.position.set(this.m.at(-2).position.x - 2, this.currentHeight, this.m.at(-2).position.z)
        }
        this.scene.add(mesh)
        this.move(this.m.at(-1), this.movementAxis, 3, 1000, this.config.easingFunction)
        this.reversed = false
    }

    update() {
        this.worldPhysics.update(this.instance)
        TWEEN.update()
        if (this.needsUp > 0.5) {
            this.config.offset += this.needsUp/100
            this.needsUp -= this.needsUp/100
        }
    }

    setWorldPhysics() {
        this.worldPhysics = new WorldPhysics(this.falling, this.falling2)
    }

    restart() {
        this.game.config.offset = this.offset
        this.m.forEach(e => {
            this.scene.remove(e)
        });
        this.falling.forEach(e => {
            this.scene.remove(e)
        })
        this.setInstance()
        // this.world.bodies = []
        // this.setInstance()
        // this.score.innerHTML = 0
        // this.falling.forEach(e => {
        //     this.scene.remove(e)
        // })
        // this.falling = []
        // this.falling2 = []
        // this.setWorldPhysics()
    }
}