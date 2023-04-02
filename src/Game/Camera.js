import * as THREE from 'three'
import Game from "./Game"

export default class Camera  {
    constructor(_options) 
    {
        // setup
        this.game = new Game()
        this.scene = this.game.scene
        this.config = this.game.config

        this.setInstance()
    }

    // Sets camera instance
    setInstance = () => {
        this.instance = new THREE.OrthographicCamera(this.config.width / - 230, this.config.width / 230, this.config.height / 260, this.config.height / - 260, 0, 10 );
        this.instance.position.set(2, 3.3 , 2)
        this.instance.lookAt(0, 3.3, 0)
        this.instance.updateProjectionMatrix()

        this.scene.add(this.instance)
    }

    // Resizes camera instance
    resize = () => {
        console.log(this.config)
        this.instance.aspect = this.config.width / this.config.height
        this.instance.updateProjectionMatrix()

        this.instance.left = this.config.width / - 230
        this.instance.right = this.config.width / 230
        this.instance.top = this.config.height / 260
        this.instance.bottom = this.config.height / - 260
    }
    

    // Updates camera instance
    update = () => {
        this.instance.position.set(2, this.config.offset , 2);
        this.instance.lookAt(0, this.instance.position.y - 2.2, 0);
    }
}