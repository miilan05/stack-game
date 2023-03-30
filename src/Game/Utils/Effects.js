import * as TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three'

export default class Effects {
    // Adds an effect (plane mesh) that fades away
    static perfectEffect = (scene, position, x, y) => {
        // we create the mesh
        let geometry = new THREE.PlaneGeometry(x, y)
        let material = new THREE.MeshStandardMaterial({color: 0xffffff, transparent: true}) 
        let mesh = new THREE.Mesh(geometry, material)
        mesh.rotation.x = -Math.PI/2;
        mesh.position.copy(position)
        mesh.position.y -= 0.05
        // create and start the fadding effect
        let fade = new TWEEN.Tween(mesh.material).to({opacity: 0}, 750)
        fade.start()
        // remove the mesh after the effect ended
        setTimeout(() => {
            scene.remove(mesh)
        }, 750)
        scene.add(mesh)
    }
}