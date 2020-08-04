import {PerspectiveCamera} from './three.module.js';

var camera = {

    /** ThreeJS Instance of camera for rendering */
    cam3: null,

    /** Initialize ThreeJS instance */
    init: function () {
        this.cam3 = new PerspectiveCamera(75, 1, 0.1, 1000);
        this.cam3.position.y = 1.6;
    },

    /** Resize aspect ration of camera after window resize */
    resize: function () {
        this.cam3.aspect = window.innerWidth / window.innerHeight;
        this.cam3.updateProjectionMatrix();
    },

};

export default camera;