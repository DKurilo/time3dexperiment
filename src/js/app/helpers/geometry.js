import * as THREE from 'three';

import Material from './material';

import Config from '../../data/config';

// This helper class can be used to create and then place geometry in the scene
export default class Geometry {
  constructor(scene, texture) {
    this.scene = scene;
    this.geo = null;
    this.texture = texture;
  }

  make(type) {
    if(type == 'plane') {
      return (width, height, widthSegments = 1, heightSegments = 1) => {
        this.geo = new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
        this.width = width;
        this.height = height;
      };
    }

    if(type == 'sphere') {
      return (radius, widthSegments = 32, heightSegments = 32) => {
        this.geo = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
      };
    }
  }

  place(position, rotation) {

    const vertices = this.geo.vertices;
    const positions = new Float32Array( vertices.length * 3 );
    for ( var i = 0, l = vertices.length; i < l; i ++ ) {
      const vertex = vertices[ i ];
      vertex.toArray( positions, i * 3 );
    }
    const geometry = new THREE.BufferGeometry();
    geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

    const material = new Material(0xff0000, this.texture, this.width, this.height).pointMaterial;
    const mesh = new THREE.Points(geometry, material);

    // Use ES6 spread to set position and rotation from passed in array
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);

    if(Config.shadow.enabled) {
      mesh.receiveShadow = true;
    }

    this.scene.add(mesh);
  }
}
