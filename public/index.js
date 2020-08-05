// Siehe https://discoverthreejs.com/book/first-steps/resize/

import * as THREE from './js/three.module.js';
import environment from './js/environment.js';
import camera from './js/camera.js';
import controls from './js/controls.js';
import { LogPanel } from './js/geometries.js';

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
    var logPanel = new LogPanel(30, 20, 80, 25, '#004', '#6f6');
    logPanel.position.z = -30;
    logPanel.position.y = 10;
    environment.scene.add(logPanel);
};

window.addEventListener('load', function() {
    init();
    resize();
    renderer.setAnimationLoop(function() {
        controls.update();
        renderer.render(environment.scene, camera.cam3);
    });
});