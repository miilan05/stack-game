"use strict";

import './style.css'
import Game from './Game/Game'

const game = new Game({
    targetElement: document.querySelector('.game')
})

// function restart() {
//     m.forEach(e => {
//         scene.remove(e)
//     });
//     init()
//     score.innerHTML = 0
//     falling.forEach(e => {
//         scene.remove(e)
//     })
//     falling2.forEach(e => {
//         world.removeBody(e)
//     })
//     falling = []
//     falling2 = []
// }
