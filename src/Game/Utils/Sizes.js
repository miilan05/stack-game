import EventEmitter from "./EventEmmiter"

export default class Sizes extends EventEmitter  {
    constructor() 
    {
        super()
        this.trigger('resize')
        this.trigger('resize')

        // setup
        this.width = window.innerWidth
        this.height = window.innerHeight
        this.pixelRatio = Math.min(window.devicePixelRatio, 2)

        //Resize event
        window.addEventListener('resize', ()=>{
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)

            this.trigger('resize')
            this.trigger('resize')
        })
    }

    openFullScreen() {
        var el = document.documentElement,
        rfs = el.requestFullscreen
        || el.webkitRequestFullScreen
        || el.mozRequestFullScreen
        || el.msRequestFullscreen
        ;
        rfs.call(el);
    }
}