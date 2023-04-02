import * as CANNON from 'cannon-es'

export default class Config {
    constructor() {
        this.config = {}
        this.config.map = {static: [], falling: []}
        // Add event listener to every menu button
        const gridItems = document.querySelectorAll('.grid-item');
        gridItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                if (index == 31) {
                    this.config.easingFunction = this.config.easingFunctions[Math.ceil(Math.random() * 31)]
                }
                else {
                    this.config.easingFunction = this.config.easingFunctions[index]
                }
            });
        });

        this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2)
        const boundings = document.querySelector('.game').getBoundingClientRect()
        this.config.width = boundings.width
        this.config.height = boundings.height || window.innerHeight
        this.config.randomizeColor = true // if set to false change .color to the prefered value
        this.config.color = 100 // hsl value
        this.config.colorIncrement = 3 // color incrementation after every click
        this.config.movementAxis = "x" // current and srarting movement axis
        this.config.currentShape = {x: 2, y: 2} // current and starting shape
        this.config.offset = 2.8 // camera z offset from 0
        this.config.needsUp = 0 
        this.config.cubeHeight = 0.24 
        this.config.currentHeight = this.config.cubeHeight * 2 + 0.02; // the height at which cubes are placed
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
        this.config.easingFunction = this.config.easingFunctions[0]
        this.config.score = document.getElementById("score")
        this.config.menu = document.getElementById("grid-container")
        this.config.gameElement = document.querySelector('.game')
    }
  }