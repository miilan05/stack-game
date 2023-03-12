import * as CANNON from 'cannon-es'

export default class WorldPhysics {
    constructor(meshList, bodyList) {
        this.meshList = meshList
        this.bodyList = bodyList
    }

    update(world) {
        for(let i = 0; i < this.meshList.length; i++) {
            this.meshList[i].position.copy(this.bodyList[i].position)
            this.meshList[i].quaternion.copy(this.bodyList[i].quaternion)
        }

        console.log("d")

        let now = Date.now()
        let then = 0;
        let delta;
        let isRunning = true;
        
        const interval = 1000 / 60; // 60fps
        const maxSubSteps = 1;
        const timeStep = 1 / 60;   // (one second)
    
    
        delta = (now - then);
        if (delta > interval && isRunning) {
        world.step(timeStep, delta, maxSubSteps);
        // render(...);
        then = now - (delta % interval);
        }
    }
}