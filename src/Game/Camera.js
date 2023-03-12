import * as THREE from 'three'
import Game from "./Game"

export default class Camera  {
    constructor(_options) 
    {
        this.game = new Game()
        this.scene = this.game.scene
        this.config = this.game.config

        this.setInstance()
    }

    setInstance() {
        // Set up 
        this.instance = new THREE.OrthographicCamera(this.config.width / - 240, this.config.width / 240, this.config.height / 280, this.config.height / - 280, 0, 10 );
        this.instance.position.set(2, 3.3 , 2)
        this.instance.lookAt(0, 3.3, 0)
        this.instance.updateProjectionMatrix()

        this.scene.add(this.instance)
    }

    resize() {
        this.instance.aspect = this.config.width / this.config.height
        this.instance.updateProjectionMatrix()

        this.instance.left = this.config.width / - 240
        this.instance.right = this.config.width / 240
        this.instance.top = this.config.height / 280
        this.instance.bottom = this.config.height / - 280
        // this.instance.lookAt(0, 0.3, 0)
        // this.instance.updateProjectionMatrix();
    }

    update() {
        this.instance.position.set(2, this.config.offset , 2);
        this.instance.lookAt(0, this.instance.position.y - 2, 0);
    }
}