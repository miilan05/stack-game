"use strict";

import './style.css'
import Game from './Game/Game'

// HIGH IMPORTANCE :
// ADD MORE VARIABLES TO CONFIG FOR MORE CONTROLL
// ORDER THE CONFIG CLASS VARIABLES BETTER

//  CREATE MENU UI
// CHANGE NEEDSUP
// ADD SPEED INCREASE OVER TIME
// ADD COMMENTS EVERYWHERE AND CREATE A README FILE 

// by creating the game variable we initialize the game
const game = new Game({
    targetElement: document.querySelector('.game')
})