"use strict";

import './style.css'
import Game from './Game/Game'

//  CREATE MENU UI
// ADD SPEED INCREASE OVER TIME
// CONVERT M VARIABLE TO A MAP
// ADD EXIT FULLSCREEN AND FIX FULLSCREEN
// ADD COMMENTS EVERYWHERE AND CREATE A README FILE 
// ADD MORE VARIABLES TO CONFIG FOR MORE CONTROLL
// ORDER THE CONFIG CLASS VARIABLES BETTER

// by creating the game variable we initialize the game
const game = new Game({
    targetElement: document.querySelector('.game')
})