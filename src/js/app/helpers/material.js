import * as THREE from 'three';

import Config from '../../data/config';

// USe this class as a helper to set up some default materials
export default class Material {
  constructor(color, texture, width, height) {
    this.basic = new THREE.MeshBasicMaterial({
      color,
      side: THREE.DoubleSide
    });

    this.standard = new THREE.MeshStandardMaterial({
      color: color,
      shading: THREE.FlatShading,
      roughness: 1,
      metalness: 0,
      side: THREE.DoubleSide,
    });

    const vertShader = `uniform float pointSize;
uniform sampler2D map;
uniform float width;
uniform float height;

varying vec2 vUv;

void main() {
  vUv = vec2( .5 + position.x / width, 0.5 - position.y / height );

  gl_PointSize = pointSize;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;
    const fragShader = `uniform sampler2D map;
varying vec2 vUv;
void main() {
  vec4 color = texture2D( map, vUv );
  gl_FragColor = vec4( color.r, color.g, color.b, 1.0 );
}`;
    this.pointMaterial = new THREE.ShaderMaterial( {
      uniforms: {
        pointSize: { value: 5.0 },
        map: { value: texture },
        width: { value: width },
        height: { value: height },
      },
      vertexShader: vertShader,
      fragmentShader: fragShader,
      transparent: true
    } );



    this.wire = new THREE.MeshBasicMaterial({wireframe: true});
  }
}

