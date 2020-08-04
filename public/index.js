// Siehe https://discoverthreejs.com/book/first-steps/resize/

import * as THREE from './js/three.module.js';
import environment from './js/environment.js';
import camera from './js/camera.js';
import controls from './js/controls.js';

var renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);

// Window resize
var resize = function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.resize();
};
window.addEventListener('resize', resize);

// Initialize scene content
// Das hier muss später von den Universen kommen
var init = function() {
    environment.init();
    camera.init();
    controls.init(renderer);
};

// NEXT: World plane, Raum-Rahmen und Box in der Ecke
// NEXT: PointerLockControls https://threejs.org/examples/#misc_controls_pointerlock, besser Point-and-Click für Maus-Teleport https://threejs.org/examples/#webgl_interactive_cubes

window.addEventListener('load', function() {
    init();
    resize();
    renderer.setAnimationLoop(function() {
        renderer.render(environment.scene, camera.cam3);
    });
});
