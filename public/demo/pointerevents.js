// Siehe https://discoverthreejs.com/book/first-steps/resize/

import { BoxGeometry, MeshPhongMaterial, WebGLRenderer} from '../js/lib/three.module.js';
import environment from './environment.js';
import camera from './camera.js';
import controls from './controls.js';
import { EventMesh, LogPanel } from './geometries.js';

var renderer = new WebGLRenderer();
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
    // Cube
    var cube = new EventMesh(
        new BoxGeometry(),
        new MeshPhongMaterial({ color: 0xffeb3b, emissive: 0x484210 })
    );
    cube.position.y = .5;
    cube.position.z = -5;
    cube.addEventListener(EventMesh.EventType.PointerEnter, () => {
        logPanel.log('Enter Cube');
    });
    cube.addEventListener(EventMesh.EventType.PointerLeave, () => {
        logPanel.log('Leave Cube');
    });
    cube.addEventListener(EventMesh.EventType.ButtonDown, (button, point, controller) => {
        logPanel.log('Down: ' + button + ' ' + JSON.stringify(point));
        if (button === EventMesh.ButtonCode.QuestRightGrip) {
            controller.attach(cube);
        }
    });
    cube.addEventListener(EventMesh.EventType.ButtonUp, (button, point) => {
        logPanel.log('Up: ' + button + ' ' + JSON.stringify(point));
        if (button === EventMesh.ButtonCode.QuestRightGrip) {
            environment.scene.attach(cube);
        }
    });
    cube.enableForRayCaster = true;
    environment.scene.add(cube);
};

window.addEventListener('DOMContentLoaded', async function() {
    init();
    resize();
    renderer.setAnimationLoop(function() {
        controls.update();
        renderer.render(environment.scene, camera.cam3);
    });
});
