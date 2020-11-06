// Siehe https://discoverthreejs.com/book/first-steps/resize/

import * as THREE from './lib/three.module.js';
import environment from './environment.js';
import camera from './camera.js';
import controls from './controls.js';
import { LogPanel } from './geometries.js';
import elements from '/api/elements/lib';

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

window.addEventListener('DOMContentLoaded', async function() {
    init();
    resize();
    renderer.setAnimationLoop(function() {
        controls.update();
        renderer.render(environment.scene, camera.cam3);
    });

    var ids = await elements.getIdList();
    console.log(ids);
    for (var id of ids) {
        var element = await elements.get(id);
        console.log(element);
    }
    var newElement = { 'trullala' : 'fullepulle' };
    var id = await elements.save(newElement);
    console.log(id);
    console.log(await elements.getIdList());
    console.log(await elements.get(id));
    newElement.trullala = 'hoppsassa';
    await elements.save(newElement, id);
    console.log(await elements.get(id));
    await elements.del(id);
    console.log(await elements.getIdList());
});
