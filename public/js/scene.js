import { AmbientLight, BackSide, DirectionalLight, Mesh, MeshBasicMaterial, PlaneGeometry, Scene, SphereGeometry, WebGLRenderer} from './lib/three.module.js';
import { Camera } from './camera.js';
import { Controls } from './controls.js';
import { EventExtension, TeleportExtension } from './extensions.js';
import { Plane, PointerLine, Sphere } from './geometries.js';

/**
 * Vorlage für alle möglichen Szenen-Demos.
 * Initialisiert Umgebung, Kamera, Licht, etc.
 * 
 * @example Properties:
 * this.renderer (WebGLRenderer)
 * this.scene (Scene)
 * this.ground (Plane)
 * this.sky (Sphere)
 * this.sun (Sphere)
 * this.sunLight (DirectionalLight)
 * this.ambientLight (AmbientLight)
 * this.camera (Camera)
 * this.controls (Controls)
 * this.eventExtension (EventExtension)
 * this.teleportExtension (TeleportExtension)
 */
class SceneTemplate {

    constructor() {
        this.sceneRadius = 100; // Radius des Himmels auf 100 Meter festlegen
        // ThreeJS Renderer initialisieren und an HTML Body anhängen. Dort passiert alles.
        this.renderer = new WebGLRenderer();
        document.body.appendChild(this.renderer.domElement);
        // Auf window-resize lauschen
        window.addEventListener('resize', () => this.resize());
        // Umgebung und Kamera initialisieren
        this.scene = new Scene();
        // Kamera
        this.camera = new Camera();
        this.scene.add(this.camera.head);
        // Bewegungskontrollen initialisieren. Die brauchen aber nicht der Szene hinzugefügt werden
        this.controls = new Controls(this.camera, this.renderer, []);
        // EventExtension vorbereiten
        this.eventExtension = new EventExtension(this.controls);
        // TeleportExtension vorbereiten
        this.teleportExtension = new TeleportExtension(this.camera);

        // Diverse Inhalte der Szenenvorlage

        // Teleportierbarer Boden
        this.ground = new Plane();
        this.ground.geometry.scale(this.sceneRadius * 2, this.sceneRadius * 2, 1);
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.material.color.set('#4a5');
        this.scene.add(this.ground);
        this.eventExtension.apply(this.ground);
        this.teleportExtension.apply(this.ground);
        // Himmel
        this.sky = new Sphere();
        this.sky.geometry.scale(this.sceneRadius * 10, this.sceneRadius * 10, this.sceneRadius * 10);
        this.sky.material.side = BackSide;
        this.sky.material.depthWrite = false;
        this.sky.material.color.set('#0bd');
        this.scene.add(this.sky);
        // Sonne und Sonnenlicht von schräg oben
        this.sun = new Sphere();
        this.sun.geometry.scale(5, 5, 5);
        this.sun.material.color.set('#ff0');
        this.sun.material.emissive.set('#ff0');
        this.sun.position.set(-70, 100, 50);
        this.scene.add(this.sun);
        this.sunLight = new DirectionalLight( '#fff', 1 );
        this.sunLight.position.set(-70, 100, 50);
        this.scene.add(this.sunLight);
        // Ambiente Hintergrundbeleuchtung
        this.ambientLight = new AmbientLight( '#888' );
        this.scene.add(this.ambientLight);

        // Zeiger an rechten XR-Controller hängen, wenn es einen gibt
        // TODO: Das geht hier noch nicht. Wir müssen warten, bis ein
        // Connected-Event kommt... und dieses auch implementieren
        this.pointerLine = new PointerLine();
        this.controls.addEventListener(Controls.EventType.ControllerConnected, (_, data) => {
            let controller = data.controller;
            console.log(controller.xrInputSource.handedness, controller, controller.grip, this.pointerLine);
            if (controller.xrInputSource.handedness === 'right') {
                controller.add(this.pointerLine);
            }
        });

        // Einmalig resizen, damit der Canvas so groß wie das Browserfenster wird
        this.resize();
        this.renderer.setAnimationLoop(() => this.animationLoop());
    }

    /**
     * Führt den Animation Loop aus und rendert die Szene 60 Mal in der Sekunde
     */
    animationLoop() {
        this.controls.processAnimationFrame();
        this.renderer.render(this.scene, this.camera.cam3);
    }

    /**
     * Wenn das Fenster verändert wird, muss der Apsect Ratio der Kamera und des
     * Renderers angepasst werden.
     */
    resize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.resize();
    }

}

export { SceneTemplate }