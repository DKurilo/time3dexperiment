// Global imports -
import * as THREE from 'three';

// Local imports -
// Components
import Renderer from './components/renderer';
import Camera from './components/camera';
import Light from './components/light';
import Controls from './components/controls';

// Helpers
import Geometry from './helpers/geometry';

// Texure
import Texture from './model/texture';

// Managers
import Interaction from './managers/interaction';

// data
import Config from './../data/config';
// -- End of imports


// This class instantiates and ties all of the components together, starts the loading process and renders the main loop
export default class Main {
  constructor(container) {
    // Set container property to container element
    this.container = container;

    // Start Three clock
    this.clock = new THREE.Clock();

    // Main scene creation
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(Config.fog.color, Config.fog.near);

    // Get Device Pixel Ratio first for retina
    if(window.devicePixelRatio) {
      Config.dpr = 1;
    }

    // Main renderer instantiation
    this.renderer = new Renderer(this.scene, container);

    // Components instantiation
    this.camera = new Camera(this.renderer.threeRenderer);
    this.controls = new Controls(this.camera.threeCamera, container);
    this.light = new Light(this.scene);

    // Create and place lights in scene
    const lights = ['ambient', 'directional', 'point', 'hemi'];
    for(let i = 0; i < lights.length; i++) {
      this.light.place(lights[i]);
    }

    // Instantiate texture class
    this.texture = new Texture();

    // Start loading the textures and then go on to load the model after the texture Promises have resolved
    this.texture.load().then(() => {
      //this.manager = new THREE.LoadingManager();

      // Textures loaded, load model
      //this.model = new Model(this.scene, this.manager, this.texture.textures);
      //this.model.load();

      let i = 0;
      Object.entries(this.texture.textures).forEach(([key, el]) => {
        this.geometry = new Geometry(this.scene, el);
        this.geometry.make('plane')(192, 108, 150, 150);
        this.geometry.place([0, i * 2, 0], [Math.PI/2, 0, 0]);
        i++;
      });

      new Interaction(this.renderer.threeRenderer, this.scene, this.camera.threeCamera, this.controls.threeControls);

      Config.isLoaded = true;
      this.container.querySelector('#loading').style.display = 'none';
    });

    // Start render which does not wait for model fully loaded
    this.render();
  }

  render() {
    // Call render function and pass in created scene and camera
    this.renderer.render(this.scene, this.camera.threeCamera);
    this.controls.threeControls.update();

    // RAF
    requestAnimationFrame(this.render.bind(this)); // Bind the main class instead of window object
  }
}
