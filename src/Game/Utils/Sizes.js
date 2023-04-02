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
        this.fullScreenButton = document.getElementById("window-fullscreen")

        //Resize event
        window.addEventListener('resize', ()=>{
            this.width = window.innerWidth
            this.height = window.innerHeight
            this.pixelRatio = Math.min(window.devicePixelRatio, 2)

            this.trigger('resize')
            this.trigger('resize')
        })
    }

    toggleFullScreen = () => {
        var doc = window.document;
        var docEl = doc.documentElement;
     
        var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
     
        if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
            requestFullScreen.call(docEl);
            this.fullScreenButton.textContent = "Close Fullscreen"
        }
        else {
            cancelFullScreen.call(doc);
            this.fullScreenButton.textContent = "Open Fullscreen"
        }
    }
}