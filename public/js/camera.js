import {Object3D, PerspectiveCamera} from './lib/three.module.js';

/**
 * VR Kamera. Muss nach Initialisierung noch an Szene angehangen werden:
 * 
 * @example
 * let camera = new Camera();
 * environment.scene.add(camera.head);
 */
class Camera {

    constructor() {
        // Das ist der Kopf, der mit der VR-Brille gedreht wird
        this.head = new Object3D();
        // Das hier ist die Kamera im Kopf drin
        this.cam3 = new PerspectiveCamera(75, 1, 0.1, 1000);
        // Standardhöhe der Augen sind 1,6 Meter
        this.cam3.position.y = 1.6;
        this.head.add(this.cam3);
    }

    /**
     * Muss bei einem window.resize - Ereignis aufgerufen werden,
     * damit der Aspect Ratio der Kamera angepasst werden kann.
     */
    resize() {
        this.cam3.aspect = window.innerWidth / window.innerHeight;
        this.cam3.updateProjectionMatrix();
    }

}

export { Camera }