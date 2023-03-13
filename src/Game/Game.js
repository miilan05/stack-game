"use strict";

import * as THREE from 'three'
import Sizes from "./Utils/Sizes"
import Camera from './camera'
import Renderer from './Renderer'
import World from './World'
import Config from './Config'
import Menu from './Utils/Menu';

export default class Game {
    static instance

    constructor(_options = {}) {
        if(Game.instance)
        {
            return Game.instance
        }
        Game.instance = this

        this.targetElement = _options.targetElement

        this.setConfig()
        this.setScene()
        this.setCamera()
        this.setRenderer()
        this.setWorld()
        // this.setWorldPhysics()

        this.sizes = new Sizes()
        this.sizes.on('resize', ()=> { this.resize() })
        
        this.menu = new Menu()
        this.menu.TogleMenu()
        this.menu.on('togleMenu', () => { this.menu.TogleMenu() } )
        this.menu.on('openFullScreen', () => {this.sizes.openFullScreen()})

        this.update()


    }

    setConfig() {
        this.config = new Config().config
    }

    resize() {
        // Config
        const boundings = this.targetElement.getBoundingClientRect()
        this.config.width = boundings.width
        this.config.height = boundings.height
        this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

        if(this.camera)
            this.camera.resize()

        if(this.renderer)
            this.renderer.resize()
    }

    setScene() {
        this.scene = new THREE.Scene()
    }

    setCamera() {
        this.camera = new Camera()
    }

    setRenderer() {
        this.renderer = new Renderer({ rendererInstance: this.rendererInstance })
        this.targetElement.appendChild(this.renderer.instance.domElement)
    }

    setWorld() {
        this.world = new World()
    }

    // setWorldPhysics() {
    //     this.worldPhysics = new WorldPhysics(this.world.falling, this.world.falling2)
    // }

    update() {
        this.camera.update()
        if(this.renderer)
            this.renderer.update()
        if(this.world)
            this.world.update()

        window.requestAnimationFrame(() =>
        {
            console.log("dd")
            this.update()
        })
    }
}