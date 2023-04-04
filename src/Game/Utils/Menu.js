import Game from "../Game"
import EventEmitter from "./EventEmmiter"

export default class Menu extends EventEmitter {
    constructor() {
        super()
        // setup
        this.config = new Game().config
        this.menu = this.config.menu
        this.menuToggleButton = this.config.menuToggleButton
        this.score = this.config.score;
        this.highscore = this.config.highscore
        this.fullScreenButton = this.config.fullScreenButton
        this.ui = this.config.ui

        this.menuToggleButton.addEventListener('click', () => {
            this.trigger('toggleMenu')
        })
        this.fullScreenButton.addEventListener('click', () => {
            this.trigger('toggleFullScreen')
        })
        this.opened = true
    }
    
    // Toggles movement menu
    // IMPROVE THIS!
    ToggleMenu = () => {
        if (this.opened) {
            this.menu.style.height = "0";
            this.menu.style.width = "0";
            this.menu.style.zIndex = "";
            this.menuToggleButton.textContent = "Maximize Menu";
        } 
        else {
          const menuWidth = Math.min(600, window.innerWidth);
          const menuHeight = Math.min(600, window.innerWidth) / 2;
          this.menu.style.width = `${menuWidth}px`;
          this.menu.style.height = `${menuHeight}px`;
          this.menu.style.zIndex = "1"; // Add z-index
          this.menuToggleButton.textContent = "Minimize Menu";
        }
        this.opened = !this.opened;
      };

    ToggleUI = (bool) => {
        this.ToggleElementVisibility(this.ui, bool)
    }

    ToggleScore = (bool) => {
        this.ToggleElementVisibility(this.score, bool)
    }

    ToggleHighScore = (bool) => {
        this.ToggleElementVisibility(this.highscore, bool)
    }

    ToggleElementVisibility = (e, bool) => {
        if (bool) {
            e.style.visibility = "visible"
        }
        else {
            e.style.visibility = "hidden"
        }
    }

}
