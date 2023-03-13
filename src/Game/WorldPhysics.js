import * as CANNON from 'cannon-es'

import * as THREE from 'three'

export default class WorldPhysics {
    constructor(meshList, bodyList) {
        this.meshList = meshList
        this.bodyList = bodyList
        this.clock = new THREE.Clock()
    }

    update(world) {
        for(let i = 0; i < this.meshList.length; i++) {
            this.meshList[i].position.copy(this.bodyList[i].position)
            this.meshList[i].quaternion.copy(this.bodyList[i].quaternion)
        }
        world.step(1/180, this.clock.getDelta())
    }
}