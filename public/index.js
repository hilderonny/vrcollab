// Siehe https://discoverthreejs.com/book/first-steps/resize/

import * as THREE from './js/three.module.js';

// Scene and renderer
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement);

// Camera
var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
camera.position.z = 5;

// Window resize
var resize = function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
};
window.addEventListener('resize', resize);

// Initialize scene content
// Das hier muss später von den Universen kommen
var cube; 
var init = function() {
    // Geometry
    var geometry = new THREE.BoxGeometry();
    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
};
var animateCube = function () {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
};

// Handle scene updates every frame (animation, logic)
var update = function() {
    // Das hier muss später von den Universen kommen
    animateCube();
};

// Render the scene
var render = function() {
    renderer.render(scene, camera);
};

// NEXT: World plane, Raum-Rahmen und Box in der Ecke
// NEXT: PointerLockControls https://threejs.org/examples/#misc_controls_pointerlock, besser Point-and-Click für Maus-Teleport https://threejs.org/examples/#webgl_interactive_cubes

window.addEventListener('load', function() {
    init();
    resize();
    renderer.setAnimationLoop(function() {
        update();
        render();
    });
});
