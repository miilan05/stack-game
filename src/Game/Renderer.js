import * as THREE from 'three'
import Game from './Game'

export default class Renderer {
    constructor() {
        this.game = new Game()
        this.config = this.game.config
        this.camera = this.game.camera
        this.sizes = this.game.sizes
        this.scene = this.game.scene

        this.setInstance()
    }

    setInstance() {
        this.instance = new THREE.WebGLRenderer({antialias: true, alpha:true})
        this.instance.shadowMap.enabled = true
        this.instance.setClearColor(0x000000, 0)
        this.instance.setSize(this.config.width, this.config.height)
        this.instance.setPixelRatio(this.config.pixelRatio, 2)
        this.instance.shadowMap.type = THREE.PCFSoftShadowMap
    }

    update() {
        this.instance.render(this.scene, this.camera.instance)
    }

    resize()
    {
        this.instance.setSize(this.config.width, this.config.height)
        this.instance.setPixelRatio(this.config.pixelRatio)
    }

}