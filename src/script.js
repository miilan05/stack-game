import * as THREE from "three";
import './style.css';
// import {OrbitControls} from '../node_modules/three/examples/jsm/controls/OrbitControls';
import * as tween from '@tweenjs/tween.js'
import * as CANNON from 'cannon-es'

let movementAxis, m, currentHeight, camera, renderer, speed, lost, cubeHeight, geometry, material, mesh, meshStatic,
offset, light2, light3, n, nInc, controls, reversed, needsUp, distance = 2, currentShape, sizes
const canvas = document.getElementById("three"), scene = new THREE.Scene();
let falling = []
let falling2 = []

/*
IMPROVE MOVEMENT
ADD PHYSICS
IMPROVE BACKGROUND GRADIENT
*/
let world;

function meshToBody(mesh, mass, returnBody = false) {
    let position = mesh.position
    let geometry = mesh.geometry.parameters
    const body = new CANNON.Body({
        mass: mass,
        position: new CANNON.Vec3(position.x, position.y, position.z),
        shape: new CANNON.Box(new CANNON.Vec3(geometry.width / 2, geometry.height/ 2,  geometry.depth/ 2 )),
        quaternion: new CANNON.Quaternion().setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI / 2)
    })
    if (returnBody) {
        return body
    }
}

function init() {
    sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    currentShape = {x: 2, y: 2}
    offset = 3.3
    needsUp = 0
    movementAxis = "x"; 
    speed = 0.05
    m = []
    n = Math.floor(Math.random() * 360)
    nInc = 3
    cubeHeight = 0.24
    currentHeight = 0.5;
    reversed = false
    lost = false
    world = new CANNON.World()
    world.gravity.set(0, -10, 0)

    const texture = new THREE.TextureLoader().load( "./1.jpg" );
    let staticGeo = new THREE.BoxGeometry(currentShape.x, 2, currentShape.y, 1);
    let staticTransparentMaterial = new THREE.MeshStandardMaterial({color: `hsl(${n%360}, 100%, 30%)`, alphaMap: texture, transparent: true})
    const cubeMaterials = [
        staticTransparentMaterial,
        staticTransparentMaterial,
        new THREE.MeshStandardMaterial({color: `hsl(${n%360}, 100%, 30%)`}),
        staticTransparentMaterial,
        staticTransparentMaterial,
        staticTransparentMaterial
    ];
    meshStatic = new THREE.Mesh(staticGeo, cubeMaterials);
    meshStatic.position.set(0, -0.5 - cubeHeight/2, 0)
    meshStatic.receiveShadow = true
    m.push(meshStatic)
    world.addBody(meshToBody(meshStatic, 0, true))

    n += nInc

    geometry = new THREE.BoxGeometry(currentShape.x, currentShape.y, cubeHeight);
    material = new THREE.MeshStandardMaterial({color: `hsl(${n%360}, 100%, 40%)`});
    mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.rotation.x = Math.PI/2;
    mesh.position.x = -2
    mesh.position.y = currentHeight
    m.push(mesh)

    n += nInc

    light2 = new THREE.AmbientLight(0xffffff, 0.4);
    light3 = new THREE.DirectionalLight(0xffffff, 0.6);
    light3.castShadow = true
    light3.position.set(300, 600, -300);
    light3.shadow.camera.position.set(-10, 300, -10)
    light3.shadow.mapSize.width = 1024 * 4
    light3.shadow.mapSize.height = 1024 * 4
    
    // const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 3, 1000);
    camera = new THREE.OrthographicCamera(window.innerWidth / - 240, window.innerWidth / 240, window.innerHeight / 280, window.innerHeight / - 280, 0, 10 );
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0.3, 0)
    
    renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha:true});
    renderer.shadowMap.enabled = true
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.render(scene, camera);
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    // controls = new OrbitControls(camera, renderer.domElement);
    // controls.enableRotate = true
    updateBackground()
    scene.add(meshStatic, mesh);

}

window.addEventListener("resize", resize)

function resize() {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    camera.aspect= sizes.width / sizes.height;
    camera.left = window.innerWidth / - 240
    camera.right = window.innerWidth / 240
    camera.top = window.innerHeight / 280
    camera.bottom = window.innerHeight / - 280
    camera.lookAt(0, 0.3, 0)
    camera.updateProjectionMatrix();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(sizes.width, sizes.height);
}

// const openFullscreen = () => {
//     var el = document.documentElement,
//     rfs = el.requestFullscreen
//       || el.webkitRequestFullScreen
//       || el.mozRequestFullScreen
//       || el.msRequestFullscreen
//       ;
//      rfs.call(el);
//      document.addEventListener("click", onClick)
//      resize()
// }

document.addEventListener("click", onClick)

function onClick() {
    needsUp+= cubeHeight
    speed += .00058
    let intersect = intersects(0.12)
    if (lost) {restart()}
    else if (intersect == false) {
        lost = true
        speed = 0
        needsUp = 0
        let body = meshToBody(m.at(-1), 1, true)
        falling.push(m.at(-1))
        falling2.push(body)
        world.addBody(body)
    }
    else if (intersect == "skip") {
            score.innerHTML = parseInt(score.innerHTML) + 1
            placeNewBlock()
            updateBackground()
            n += nInc
    }
    else {
        cutAndPlace(intersect)
        if (!lost) {
            placeNewBlock()
            updateBackground()
            n += nInc
        }
    }
}

function cutAndPlace(i) {
    currentShape.x = i.right - i.left
    currentShape.y = i.top - i.bottom
    let geometry = new THREE.BoxGeometry(currentShape.x , currentShape.y, cubeHeight)
    let mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial().copy(m.at(-1).material));
    mesh.rotation.x = Math.PI/2;
    mesh.position.set(i.left + (i.right - i.left)/2, currentHeight, i.bottom + (i.top - i.bottom)/2)
    mesh.castShadow = true  
    mesh.receiveShadow = true
    scene.remove(m.at(-1))
    m.pop()
    m.push(mesh)
    score.innerHTML = parseInt(score.innerHTML) + 1
    scene.add(mesh)

    world.addBody(meshToBody(mesh, 0, true))
}

function cutAndPlace2(piece) {
    let geometry = new THREE.BoxGeometry(piece.right - piece.left , piece.top - piece.bottom, cubeHeight)
    let mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial().copy(m.at(-1).material));
    mesh.rotation.x = Math.PI/2;
    mesh.position.set(piece.left + (piece.right - piece.left)/2, currentHeight, piece.bottom + (piece.top - piece.bottom)/2)
    let body = meshToBody(mesh, 1, true)
    falling.push(mesh)
    falling2.push(body)
    world.addBody(body)
    scene.add(mesh)
}

function restart() {
    m.forEach(e => {
        scene.remove(e)
    });
    init()
    score.innerHTML = 0
    // camera.position.set(distance, offset, distance) //
    falling.forEach(e => {
        scene.remove(e)
    })
    falling2.forEach(e => {
        world.removeBody(e)
    })
    falling = []
    falling2 = []
}

function intersects(n) {
    let cube1Pos =  m.at(-1).position
    let cube2Pos =  m.at(-2).position
    let cube1Geo =  m.at(-1).geometry.parameters
    let cube2Geo =  m.at(-2).geometry.parameters

    if (Math.abs(cube1Pos.x - cube2Pos.x) < n && Math.abs(cube1Pos.z - cube2Pos.z ) < n) {
         cube1Pos.x = cube2Pos.x
         cube1Pos.z = cube2Pos.z 
         world.addBody(meshToBody(m.at(-1), 0, true))
         perfectEffect(cube1Pos)
         return "skip"
    }
    let rect1 = {
        left: cube2Pos.x - cube2Geo.width / 2 ,
        right: cube2Pos.x - cube2Geo.width / 2 + cube2Geo.width, 
        bottom: cube2Pos.z - cube2Geo.height / 2,
        top: cube2Pos.z - cube2Geo.height / 2 + cube2Geo.height
    }

    let rect2 = {
        left: cube1Pos.x - cube1Geo.width / 2 ,
        bottom: cube1Pos.z - cube1Geo.height / 2,
        right: cube1Pos.x - cube1Geo.width / 2 + cube1Geo.width, 
        top: cube1Pos.z - cube1Geo.height / 2 + cube1Geo.height
    }

    let intersection = {
        left: Math.max(rect1.left, rect2.left),
        bottom: Math.max(rect1.bottom, rect2.bottom),
        right: Math.min(rect1.right, rect2.right),
        top: Math.min(rect1.top, rect2.top)
    }

    let piece = {
        left: rect2.left,
        right: rect2.right,
        bottom: rect2.bottom,
        top: rect2.top
    }

    if (intersection.left === rect2.left && rect2.left && intersection.right === rect2.right) {
        if (intersection.bottom === rect2.bottom) {
            piece.bottom = intersection.top
        }
        else {
            piece.top = intersection.bottom
        }
    }
    else {
        if (intersection.left === rect2.left) {
            piece.left = intersection.right
        }
        else {
            piece.right = intersection.left
        }
    }
    if ((intersection.left > intersection.right || intersection.bottom > intersection.top)) {
        return false
    }
    else {
        cutAndPlace2(piece)
        return intersection
    }
}

function placeNewBlock() {
    let geometry = new THREE.BoxGeometry(currentShape.x, currentShape.y, cubeHeight)
    material = new THREE.MeshStandardMaterial({color: `hsl(${n%360}, 100%, 50%)`});
    let mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.rotation.x = Math.PI/2;
    m.push(mesh)
    
    if (movementAxis == "x") {
        movementAxis = "z"
        currentHeight += cubeHeight
        mesh.position.set(m.at(-2).position.x, currentHeight,m.at(-2).position.z - 2)
    }
    else {
        movementAxis = "x"  
        currentHeight += cubeHeight
        mesh.position.set(m.at(-2).position.x - 2, currentHeight, m.at(-2).position.z)
    }
    scene.add(mesh)
    reversed = false
}

function move(axis) {
    if (axis == "x") {
        if (m.at(-1).position.x > 2.5) {
            reversed = true
        }
        else if (m.at(-1).position.x < -2.5) {
            reversed = false
        }
        
        if (reversed) {
            m.at(-1).position.x -= speed
        }
        else {
            m.at(-1).position.x += speed
        }
    }
    else if (axis == "z") {
        if (m.at(-1).position.z > 2.5) {
            reversed = true
        }
        else if (m.at(-1).position.z < -2.5) {
            reversed = false
        }
        
        if (reversed) {
            m.at(-1).position.z -= speed
        }
        else {
            m.at(-1).position.z += speed
        }
    }
}

function perfectEffect(position) {
    let geometry = new THREE.PlaneGeometry(currentShape.x + 0.18, currentShape.y + 0.18)
    let material = new THREE.MeshStandardMaterial({color: 0xffffff, transparent: true}) 
    let mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = -Math.PI/2;
    mesh.position.copy(position)
    let fade = new tween.Tween(mesh.material).to({opacity: 0}, 750)
    fade.start()
    setTimeout(()=>{
        scene.remove(mesh)
    }, 750)
    scene.add(mesh)
}

function updateBackground() {
    let color = "linear-gradient(180deg, "
    for(let i = 0; i < 11; i++ ) {
        color += `hsl(${(n - (i)*3)%360}, 100%, 80%) ${i * 10}%, `
    }
    color = color.substring(0, color.length - 2) + ")"
    document.body.style.background = color
}

init()
scene.add(light2, light3, camera);

function animate(time) {
    camera.position.set(distance, offset, distance) // move into animate if no controls
    camera.lookAt(0, camera.position.y - 2, 0);
    if (needsUp > 0.5) {
        offset += needsUp/100
        needsUp -= needsUp/100
    }
    move(movementAxis)
    // controls.update();
    tween.update()
	renderer.render( scene, camera );
    for(let i = 0; i < falling.length; i++) {
        falling[i].position.copy(falling2[i].position)
        falling[i].quaternion.copy(falling2[i].quaternion)
    }
    world.step(1/60)
    requestAnimationFrame( animate );
}
animate();