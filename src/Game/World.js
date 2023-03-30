import * as THREE from 'three';
import Game from './Game';
import * as TWEEN from '@tweenjs/tween.js';
import Background from './Utils/Background';
import Intersections from './Utils/Intersections';
import Effects from './Utils/Effects';
import * as CANNON from 'cannon-es';
import PhysicsUtils from './Utils/PhysicsUtils';
import WorldPhysics from './WorldPhysics';

export default class World {
    constructor(_options) {
        this.initializeWorld();
        this.addEventListeners();
    }

    initializeWorld = () => {
        this.game = new Game();
        this.config = this.game.config;
        this.setSceneAndPhysics();
        this.addLight();
    }

    addEventListeners = () => {
        document.querySelector('.game').addEventListener('click', () => {
            this.onClick();
        });
    }

    setSceneAndPhysics = () => {
        this.setInstanceVariables();
        this.setWorldPhysics();
        this.addStaticMesh();
        this.addNextMesh();
        this.startMovingMesh();
    }

    setInstanceVariables = () => {
        // we load every variable that the world class needs from the config class
        const { config } = this;
        this.falling = config.falling.slice();
        this.falling2 = config.falling2.slice();
        this.scene = this.game.scene;
        this.instance = new CANNON.World();
        this.instance.gravity.set(0, -10, 0);
        this.movementAxis = config.movementAxis;
        this.score = config.score;
        this.score.innerHTML = 0;
        this.currentShape = Object.assign({}, config.currentShape);
        this.offset = config.offset;
        this.needsUp = config.needsUp;
        this.m = config.m.slice();
        this.color = config.randomizeColor ? Math.floor(Math.random() * 360) : config.color;
        this.colorIncrement = config.colorIncrement;
        this.cubeHeight = config.cubeHeight;
        this.currentHeight = config.currentHeight;
        this.lost = config.lost;
        
        Background.updateBackground(this.color);
    }

    onClick = () => {
        const lastBlock = this.m.at(-1);
        const previousBlock = this.m.at(-2);
        
        lastBlock.tween.stop();
        this.needsUp += this.cubeHeight;
      
        const intersect = Intersections.intersects(lastBlock, previousBlock);
        // if we click but the game is lost we restart it and exit the function
        if (this.lost) { this.restart(); this.lost = false; return}
        // if there is no intersection the user has lost and the function exits
        if (!intersect) { this.lostFunction(lastBlock); return}
        // if both ifs above arent true we update everything and continue the game
        this.score.innerHTML = parseInt(this.score.innerHTML) + 1;
        Background.updateBackground(this.color);
        this.cutAndPlace(intersect.insidePiece, false);
        // in case the intersects function hasnt returnd an outside piece the user has made a perfect intersection and we play the effect
        if (!intersect.outsidePiece) { Effects.perfectEffect(this.scene, this.m.at(-1).position, this.currentShape.x + 0.2, this.currentShape.y + 0.2);} 
        else { this.cutAndPlace(intersect.outsidePiece, true); }
        
        this.placeNewBlock();
        this.color += this.colorIncrement;
      }

    lostFunction = (lastBlock) => {
        this.lost = true;
        this.needsUp = 0;
        const body = PhysicsUtils.meshToBody(lastBlock, 1, true);
        this.falling.push(lastBlock);
        this.falling2.push(body);
        this.instance.addBody(body);
    }

    addLight = () => {
        const light2 = new THREE.AmbientLight(0xffffff, 0.4);
        const light3 = new THREE.DirectionalLight(0xffffff, 0.6);
        light3.castShadow = true
        light3.position.set(300, 600, -300);
        light3.shadow.camera.position.set(-10, 300, -10)
        light3.shadow.mapSize.width = 1024 * 4
        light3.shadow.mapSize.height = 1024 * 4

        this.scene.add(light2, light3)
    }

    setWorldPhysics = () => {
        this.worldPhysics = new WorldPhysics(this.falling, this.falling2);
    }

    createMaterial = (hue, opacity = 1) => {
        const color = `hsl(${hue % 360}, 100%, ${30 + 10 * opacity}%)`;
        const material = new THREE.MeshStandardMaterial({ color });
    
        if (opacity < 1) {
        const texture = new THREE.TextureLoader().load("./images/1.jpg");
        material.alphaMap = texture;
        material.transparent = true;
        }
    
        return material;
    }
  
    createGeometry = (x, y, z) => {
        return new THREE.BoxGeometry(x, y, z);
    }
  
    addStaticMesh = () => {
        const staticGeo = this.createGeometry(this.currentShape.x, 2, this.currentShape.y);
        const staticTransparentMaterial = this.createMaterial(this.color, 0.5);
        const cubeMaterials = [
        staticTransparentMaterial,
        staticTransparentMaterial,
        this.createMaterial(this.color),
        staticTransparentMaterial,
        staticTransparentMaterial,
        staticTransparentMaterial,
        ];
    
        const meshStatic = new THREE.Mesh(staticGeo, cubeMaterials);
        meshStatic.position.set(0, -0.5 - this.cubeHeight / 2, 0);
        meshStatic.receiveShadow = true;
        this.scene.add(meshStatic);
        this.m.push(meshStatic);
        this.instance.addBody(PhysicsUtils.meshToBody(meshStatic, 0, true));
    }
  
    addNextMesh = () => {
        const geometry = this.createGeometry(this.currentShape.x, this.currentShape.y, this.cubeHeight);
        const material = this.createMaterial(this.color, 1);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(-1, this.currentHeight, 0);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.rotation.x = Math.PI / 2;
        this.scene.add(mesh);
        this.m.push(mesh);
    }
  
    cutAndPlace = (i, isFalling) => {
        const geometry = this.createGeometry(i.right - i.left, i.top - i.bottom, this.cubeHeight);
        const material = new THREE.MeshStandardMaterial().copy(this.m.at(-1).material);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(i.left + (i.right - i.left) / 2, this.currentHeight, i.bottom + (i.top - i.bottom) / 2);
        mesh.rotation.x = Math.PI / 2;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
    
        if (isFalling) {
            const body = PhysicsUtils.meshToBody(mesh, 1, true);
            this.falling.push(mesh);
            this.falling2.push(body);
            this.instance.addBody(body);
        } 
        else {
            this.currentShape.x = i.right - i.left;
            this.currentShape.y = i.top - i.bottom;
            this.scene.remove(this.m.at(-1));
            this.m.pop();
            this.m.push(mesh);
            this.instance.addBody(PhysicsUtils.meshToBody(mesh, 0, true));
        }
        this.scene.add(mesh);
    }
  
    placeNewBlock = () => {
        const geometry = this.createGeometry(this.currentShape.x, this.currentShape.y, this.cubeHeight);
        const material = this.createMaterial(this.color, 2);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.rotation.x = Math.PI/2;
        this.currentHeight += this.cubeHeight
        this.m.push(mesh)
        
        if (this.movementAxis == "x") {
            this.movementAxis = "z"
            mesh.position.set(this.m.at(-2).position.x, this.currentHeight, this.m.at(-2).position.z - 2)
        }
        else {
            this.movementAxis = "x"
            mesh.position.set(this.m.at(-2).position.x - 2, this.currentHeight, this.m.at(-2).position.z)
        }
        this.scene.add(mesh)
        this.move(this.m.at(-1), this.movementAxis, 2.7, 1000, this.config.easingFunction)
        this.reversed = false
    }

    startMovingMesh = () => {
        this.move(this.m.at(-1), "x", 2.7, 1000, this.config.easingFunction);
    }

    move = (mesh, axis, target, duration, easingFunction) => {
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

    update = () => {
        this.worldPhysics.update(this.instance);
        TWEEN.update();
        if (this.needsUp > 0.5) {
        this.config.offset += this.needsUp / 100;
        this.needsUp -= this.needsUp / 100;
        }
    }

    restart = () => {
        this.game.config.offset = this.offset;
        this.m.forEach((e) => {
        this.scene.remove(e);
        });
        this.falling.forEach((e) => {
        this.scene.remove(e);
        });
        this.setSceneAndPhysics();
    }
}