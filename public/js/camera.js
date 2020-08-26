import {Object3D, PerspectiveCamera} from './lib/three.module.js';
import environment from './environment.js';

var camera = {

    cam3: null,
    head: null,

    /** Initialize ThreeJS instance */
    init: function () {
        this.head = new Object3D();
        this.cam3 = new PerspectiveCamera(75, 1, 0.1, 1000);
        this.cam3.position.y = 1.6;
        this.head.add(this.cam3);
        environment.scene.add(this.head);
    },

    /** Resize aspect ration of camera after window resize */
    resize: function () {
        this.cam3.aspect = window.innerWidth / window.innerHeight;
        this.cam3.updateProjectionMatrix();
    },

};

export default camera;