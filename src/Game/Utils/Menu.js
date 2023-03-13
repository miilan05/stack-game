import Config from "../Config"
import EventEmitter from "./EventEmmiter"

export default class Menu extends EventEmitter {
    constructor() {
        super()

        this.config = new Config().config
        this.menu = document.getElementById(this.config.menu)
        this.text = document.getElementById("window-topbar")

        this.text.addEventListener('click', () => {
            this.trigger('togleMenu')
        })
        document.getElementById("window-fullscreen").addEventListener('click', () => {
            this.trigger('openFullScreen')
        })
        this.opened = true
    }

    TogleMenu() {
        if (this.opened) {
            console.dir()
            this.menu.style.height = "0"
            this.menu.style.width = "0"
            this.config.score.style.visibility = "visible"
            this.text.textContent = "Maximize Menu"
        }
        else {
            let cs = window.getComputedStyle(this.menu).width
            this.menu.style.width = `${Math.min(600, window.innerWidth)}px`
            this.menu.style.height = `${Math.min(600, window.innerWidth)/2}px`

            this.config.score.style.visibility = "hidden"
            this.text.textContent = "Minimize Menu"
        }
        this.opened = !this.opened
    }
}