import Config from "../Config"
import EventEmitter from "./EventEmmiter"

export default class Menu extends EventEmitter {
    constructor() {
        super()
        // setup
        this.config = new Config().config
        this.menu = document.getElementById(this.config.menu)
        this.toggleButton = document.getElementById("window-topbar")
        this.score = document.getElementById('score');

        this.toggleButton.addEventListener('click', () => {
            this.trigger('toggleMenu')
        })
        document.getElementById("window-fullscreen").addEventListener('click', () => {
            this.trigger('openFullScreen')
        })
        this.opened = true
    }
    
    // Toggles movement menu
    ToggleMenu = () => {
        if (this.opened) {
          this.menu.style.height = "0";
          this.menu.style.width = "0";
          this.menu.style.zIndex = ""; // Remove z-index
          this.score.style.visibility = "visible";
          this.toggleButton.textContent = "Maximize Menu";
        } else {
          const menuWidth = Math.min(600, window.innerWidth);
          const menuHeight = Math.min(600, window.innerWidth) / 2;
          this.menu.style.width = `${menuWidth}px`;
          this.menu.style.height = `${menuHeight}px`;
          this.menu.style.zIndex = "1"; // Add z-index
          this.score.style.visibility = "hidden";
          this.toggleButton.textContent = "Minimize Menu";
        }
        this.opened = !this.opened;
      };
}