import * as CANNON from 'cannon-es'

export default class Config {
    constructor() {
        this.config = {}
    
        const gridItems = document.querySelectorAll('.grid-item');

        gridItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (index == 31) {
                this.config.easingFunction = this.config.easingFunctions[Math.ceil(Math.random() * 32)]
            }
            else {
                this.config.easingFunction = this.config.easingFunctions[index]
            }
        });
        });

        // Pixel ratio
        this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)

        // Width and height
        const boundings = document.querySelector('.game').getBoundingClientRect()
        this.config.width = boundings.width
        this.config.height = boundings.height || window.innerHeight
        this.config.offset = 3.3

        this.config.falling = []
        this.config.falling2 = []
        this.config.movementAxis = "x"
        this.config.needsUp = 0
        this.config.m = []
        this.config.randomizeColor = true // if set to false change .color to the prefered value
        this.config.color = 100 // hsl value
        this.config.colorIncrement = 3
        this.config.cubeHeight = 0.24
        this.config.currentHeight = 0.5;
        this.config.lost = false
        this.config.movementAxis = "x"
        this.config.score = document.getElementById("score")
        this.config.currentShape = {x: 2, y: 2}
        this.config.offset = 3.3
        this.config.needsUp = 0
        this.config.m = []
        this.config.n = Math.floor(Math.random() * 360)
        this.config.nInc = 3
        this.config.cubeHeight = 0.24
        this.config.currentHeight = 0.5;
        this.config.lost = false
        this.config.easingFunctions = [
            ["Linear","None"],
            ["Quadratic", "In"],
            ["Quadratic", "Out"],
            ["Quadratic", "InOut"],
            ["Cubic", "In"],
            ["Cubic", "Out"],
            ["Cubic", "InOut"],
            ["Quartic", "In"],
            ["Quartic", "Out"],
            ["Quartic", "InOut"],
            ["Quintic", "In"],
            ["Quintic", "Out"],
            ["Quintic", "InOut"],
            ["Sinusoidal", "In"],
            ["Sinusoidal", "Out"],
            ["Sinusoidal", "InOut"],
            ["Exponential", "In"],
            ["Exponential", "Out"],
            ["Exponential", "InOut"],
            ["Circular", "In"],
            ["Circular", "Out"],
            ["Circular", "InOut"],
            ["Elastic", "In"],
            ["Elastic", "Out"],
            ["Elastic", "InOut"],
            ["Back", "In"],
            ["Back", "Out"],
            ["Back", "InOut"],
            ["Bounce", "In"],
            ["Bounce", "Out"],
            ["Bounce", "InOut"]]
        this.config.easingFunction = this.config.easingFunctions[8]
        this.config.menu = "window-container"
    }
  }