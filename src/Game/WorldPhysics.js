import * as CANNON from 'cannon-es'

import * as THREE from 'three'

export default class WorldPhysics {
    constructor(map) {
        this.map = map
        this.clock = new THREE.Clock()
    }

    // updates the position and rotation of the mesh from the body, and steps (updates) the cannon world
    update = (world) => {
        for(let i = 0; i < this.map.length; i++) {
            this.map[i].mesh.position.copy(this.map[i].body.position)
            this.map[i].mesh.quaternion.copy(this.map[i].body.quaternion)
        }
        world.step(1/180, this.clock.getDelta())
    }
}