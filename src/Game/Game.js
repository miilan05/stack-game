import * as THREE from 'three';
import Sizes from './Utils/Sizes';
import Camera from './camera';
import Renderer from './Renderer';
import World from './World';
import Config from './Config';
import Menu from './Utils/Menu';

export default class Game {
  static instance;

  constructor(_options = {}) {
    // Ensure only one instance of Game can be created (singleton pattern)
    if (Game.instance) {
      return Game.instance;
    }
    Game.instance = this;

    // Set the target DOM element for the game
    this.targetElement = _options.targetElement;

    // Initialize game components
    this.setConfig();
    this.setScene();
    this.setCamera();
    this.setRenderer();
    this.setWorld();

    // Set up sizes and listen for resize events
    this.sizes = new Sizes();
    this.sizes.on('resize', () => {
      this.resize();
    });

    // Set up the game menu and its event listeners
    this.menu = new Menu();
    this.menu.ToggleMenu(); 
    this.menu.on('toggleMenu', () => {
      this.menu.ToggleMenu();
    });
    this.menu.on('openFullScreen', () => {
      this.sizes.openFullScreen();
    });

    // Start the game loop
    this.update();
  }

  // Set game configuration
  setConfig = () => {
    this.config = new Config().config;
  }

  // Handle window resize events
  resize = () => {
    const boundings = this.targetElement.getBoundingClientRect();
    this.config.width = boundings.width;
    this.config.height = boundings.height;
    this.config.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);

    if (this.camera) this.camera.resize();
    if (this.renderer) this.renderer.resize();
  }

  // Create a new THREE.js scene
  setScene = () => {
    this.scene = new THREE.Scene();
  }

  // Create a new camera instance
  setCamera = () => {
    this.camera = new Camera();
  }

  // Create a new renderer instance and append it to the target element
  setRenderer = () => {
    this.renderer = new Renderer({ rendererInstance: this.rendererInstance });
    this.targetElement.appendChild(this.renderer.instance.domElement);
  }

  // Create a new world instance
  setWorld = () => {
    this.world = new World();
  }

  // Main game loop
  update = () => {
    // Update game components
    this.camera.update();
    if (this.renderer) this.renderer.update();
    if (this.world) this.world.update();

    // Request the next animation frame
    window.requestAnimationFrame(() => {
      this.update();
    });
  }
}