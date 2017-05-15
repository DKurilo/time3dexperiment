import Keyboard from '../../utils/keyboard';
import Helpers from '../../utils/helpers';
import Config from '../../data/config';

// Manages all input interactions
export default class Interaction {
  constructor(renderer, scene, camera, controls) {
    // Properties
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;

    this.timeout = null;

    // Instantiate keyboard helper
    this.keyboard = new Keyboard();

    this.isShift = false;

    // Listeners
    // Mouse events
    this.renderer.domElement.addEventListener('mousemove', (event) => Helpers.throttle(this.onMouseMove(event), 250), false);
    this.renderer.domElement.addEventListener('mouseleave', (event) => this.onMouseLeave(event), false);
    this.renderer.domElement.addEventListener('mouseover', (event) => this.onMouseOver(event), false);
    this.renderer.domElement.addEventListener( 'mousewheel', (event) => this.onMouseWheel(event), false );
    this.renderer.domElement.addEventListener( 'MozMousePixelScroll', (event) => this.onMouseWheel(event), false ); // firefox

    // Keyboard events
    this.keyboard.domElement.addEventListener('keydown', (event) => {
      // Only once
      if(event.repeat) {
        return;
      }
      if (window.event) {
        this.isShift = !!window.event.shiftKey; // typecast to boolean
      } else {
        this.isShift = !!ev.shiftKey;
      }

      if (this.isShift) {
        controls.enableZoom = false;
      }

      if(this.keyboard.eventMatches(event, 'escape')) {
        console.log('Escape pressed');
      }
    });

    this.keyboard.domElement.addEventListener('keyup', (event) => {
      if (window.event) {
        this.isShift = !!window.event.shiftKey; // typecast to boolean
      } else {
        this.isShift = !!ev.shiftKey;
      }
      if (!this.isShift) {
        controls.enableZoom = true;
      }
    });
  }

  onMouseOver(event) {
    event.preventDefault();

    Config.isMouseOver = true;
  }

  onMouseLeave(event) {
    event.preventDefault();

    Config.isMouseOver = false;
  }

  onMouseMove(event) {
    event.preventDefault();

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      Config.isMouseMoving = false;
    }, 200);

    Config.isMouseMoving = true;
  }
  
  onMouseWheel( event ) {

    if ( !this.isShift ) return;

    event.preventDefault();
    event.stopPropagation();

    var delta = 0;

    if ( event.wheelDelta !== undefined ) {

      // WebKit / Opera / Explorer 9

      delta = event.wheelDelta;

    } else if ( event.detail !== undefined ) {

      // Firefox

      delta = - event.detail;

    }

    this.camera.near += delta * Config.controls.zoomSpeed / 10;
    if (this.camera.near < 0) {
      this.camera.near = 0;
    }
    this.camera.updateProjectionMatrix();
  }
}
