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
        this.map = config.map
        this.scene = this.game.scene;
        this.instance = new CANNON.World();
        this.instance.gravity.set(0, -10, 0);
        this.movementAxis = config.movementAxis;
        this.score = config.score;
        this.score.innerHTML = 0;
        this.currentShape = Object.assign({}, config.currentShape);
        this.offset = config.offset;
        this.needsUp = config.needsUp;
        this.color = config.randomizeColor ? Math.floor(Math.random() * 360) : config.color;
        this.colorIncrement = config.colorIncrement;
        this.cubeHeight = config.cubeHeight;
        this.currentHeight = config.currentHeight;
        this.lost = config.lost;
        this.gameElement = config.gameElement
        
        Background.updateBackground(this.color);
    }

    addEventListeners = () => {
        this.gameElement.addEventListener('click', () => {
            this.onClick();
        });
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

    // the addStaticMesh and addNextMesh ads the initial meshes to the scene
    addStaticMesh = () => {
        const staticGeo = this.createGeometry(this.currentShape.x, 2, this.currentShape.y);
        const staticTransparentMaterial = this.createMaterial(this.color);

        const texture = new THREE.TextureLoader().load("./images/1.jpg");
        staticTransparentMaterial.alphaMap = texture;
        staticTransparentMaterial.transparent = true;

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
        const body = PhysicsUtils.meshToBody(meshStatic, 0, true)
        this.instance.addBody(body);
        this.map.static.push({mesh: meshStatic, body: body})
    }
  
    addNextMesh = () => {
        const geometry = this.createGeometry(this.currentShape.x, this.currentShape.y, this.cubeHeight);
        const material = this.createMaterial(this.color);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(-1, this.currentHeight, 0);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.rotation.x = Math.PI / 2;
        this.scene.add(mesh);
        this.map.static.push({mesh: mesh, body: null})
    }

    setWorldPhysics = () => {
        this.worldPhysics = new WorldPhysics(this.map.falling);
    }

    startMovingMesh = () => {
        this.move(this.map.static.at(-1).mesh, "x", 2.7, 1000, this.config.easingFunction);
    }

    createMaterial = (hue) => {
        const color = `hsl(${hue % 360}, 100%, ${30 + 10 * opacity}%)`;
        const material = new THREE.MeshStandardMaterial({ color });
    
        return material;
    }
  
    createGeometry = (x, y, z) => {
        return new THREE.BoxGeometry(x, y, z);
    }

    onClick = () => {
        const lastBlock = this.map.static.at(-1).mesh;
        const previousBlock = this.map.static.at(-2).mesh;
        
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
        if (!intersect.outsidePiece) { Effects.perfectEffect(this.scene, this.map.static.at(-1).mesh.position, this.currentShape.x + 0.2, this.currentShape.y + 0.2);} 
        else { this.cutAndPlace(intersect.outsidePiece, true); }
        
        this.placeNewBlock();
        this.color += this.colorIncrement;
    }
  
    // this function takes in the intersection coordinates and places the cut block
    cutAndPlace = (i, isFalling) => {
        const geometry = this.createGeometry(i.right - i.left, i.top - i.bottom, this.cubeHeight);
        const material = new THREE.MeshStandardMaterial().copy(this.map.static.at(-1).mesh.material);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(i.left + (i.right - i.left) / 2, this.currentHeight, i.bottom + (i.top - i.bottom) / 2);
        mesh.rotation.x = Math.PI / 2;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        // in case the block needs to fall we create the cannon body and add them to the map that updates the physics 
        if (isFalling) {
            const body = PhysicsUtils.meshToBody(mesh, 1, true);
            this.map.falling.push({mesh: mesh, body: body})
            this.instance.addBody(body);
        } 
        else {
            this.currentShape.x = i.right - i.left;
            this.currentShape.y = i.top - i.bottom;
            this.scene.remove(this.map.static.at(-1).mesh);
            this.map.static.pop()
            const body = PhysicsUtils.meshToBody(mesh, 0, true)
            this.instance.addBody(body);
            this.map.static.push({mesh: mesh, body: body})
        }
        this.scene.add(mesh);
    }
  
    // this places a new block after we clicked
    placeNewBlock = () => {
        const geometry = this.createGeometry(this.currentShape.x, this.currentShape.y, this.cubeHeight);
        const material = this.createMaterial(this.color);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.rotation.x = Math.PI/2;
        this.currentHeight += this.cubeHeight
        // we add it to the static list but it actualy isnt static (has no physics but its moving using tween)
        this.map.static.push({mesh: mesh, body: null})
        
        // depending on the current axis we place the new mesh and toggle the axis
        if (this.movementAxis == "x") {
            this.movementAxis = "z"
            mesh.position.set(this.map.static.at(-2).mesh.position.x, this.currentHeight, this.map.static.at(-2).mesh.position.z - 2)
        }
        else {
            this.movementAxis = "x"
            mesh.position.set(this.map.static.at(-2).mesh.position.x - 2, this.currentHeight, this.map.static.at(-2).mesh.position.z)
        }
        this.scene.add(mesh)
        this.move(this.map.static.at(-1).mesh, this.movementAxis, 2.7, 1000, this.config.easingFunction)
    }

    // this function moves a mesh on an axis from a to b 
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
        // we switch directions after one movement is complete
        .onComplete(()=>{
                this.move(mesh, this.movementAxis, -target, 1000, this.config.easingFunction)
        })
        .start();
    }

    lostFunction = (lastBlock) => {
        // we end the game and let the last cube fall down
        this.lost = true;
        this.needsUp = 0;
        const body = PhysicsUtils.meshToBody(lastBlock, 1, true);
        this.map.falling.push({mesh: lastBlock, body: body})
        this.instance.addBody(body);
    }

    restart = () => {
        this.game.config.offset = this.offset;
        this.map.static.forEach((e) => {
            this.scene.remove(e.mesh);
        });
        this.map.falling.forEach((e) => {
            this.scene.remove(e.mesh);
        });
        this.map.falling = []
        this.map.static = []
        this.setSceneAndPhysics();
    }

    update = () => {
        this.worldPhysics.update(this.instance);
        TWEEN.update();
        // improve this
        if (this.needsUp > 0.5) {
            this.config.offset += this.needsUp / 100;
            this.needsUp -= this.needsUp / 100;
        }
    }


}