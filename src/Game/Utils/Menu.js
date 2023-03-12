import Config from "../Config"
import EventEmitter from "./EventEmmiter"

export default class Menu extends EventEmitter {
    constructor() {
        super()

        this.config = new Config().config
        this.menu = document.getElementById(this.config.menu)
        this.menu.children.item(0).addEventListener('click', () => {
            this.trigger('togleMenu')
        })
        this.menu.children.item(1).addEventListener('click', () => {
            this.trigger('openFullScreen')
        })
        this.opened = false
    }

    TogleMenu() {
        console.log("ee")
        if (this.opened) {
            this.menu.children.item(2).style.display = "none"
            this.menu.children.item(0).innerHTML = "Maximize Menu"
            this.config.score.style.display = "block"
        }
        else {
            this.menu.children.item(2).style.display = "grid"
            this.menu.children.item(0).innerHTML = "Minimize Menu"
            this.config.score.style.display = "none"
        }
        this.opened = !this.opened
    }
}