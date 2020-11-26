import { AmbientLight, BackSide, DirectionalLight, Mesh, MeshBasicMaterial, PlaneGeometry, Scene, SphereGeometry, WebGLRenderer} from './lib/three.module.js';
import { Camera } from './camera.js';
import { Controls } from './controls.js';
import { EventExtension } from './extensions.js';

/**
 * Vorlage für alle möglichen Szenen-Demos.
 * Initialisiert Umgebung, Kamera, Licht, etc.
 * 
 * @example Properties:
 * this.renderer (WebGLRenderer)
 * this.scene (Scene)
 * this.ground (Mesh)
 * this.sky (Mesh)
 * this.sunLight (DirectionalLight)
 * this.ambientLight (AmbientLight)
 * this.camera (Camera)
 * this.controls (Controls)
 * this.eventExtension (EventExtension)
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
        // Teleportierbarer Boden, durch TeleportMesh ersetzen
        this.ground = new Mesh(
            new PlaneGeometry(this.sceneRadius * 2, this.sceneRadius * 2, 1, 1),
            new MeshBasicMaterial({ color: 0x4caf50 }) // Farbe des Bodens
        );
        this.ground.rotation.x = -Math.PI / 2;
        this.scene.add(this.ground);
        // Himmel
        this.sky = new Mesh(
            new SphereGeometry(this.sceneRadius, 50, 50, 0, 2 * Math.PI),
            new MeshBasicMaterial({ side: BackSide, depthWrite: false, color: 0x00bcd4 })
        );
        this.scene.add(this.sky);
        // Sonnenlicht von schräg oben
        this.sunLight = new DirectionalLight( '#fff', 1 );
        this.sunLight.position.x = -.7;
        this.sunLight.position.z = .5;
        this.scene.add(this.sunLight);
        // Ambiente Hintergrundbeleuchtung
        this.ambientLight = new AmbientLight( '#888' );
        this.scene.add(this.ambientLight);
        // Kamera
        this.camera = new Camera();
        this.scene.add(this.camera.head);
        // Bewegungskontrollen initialisieren. Die brauchen aber nicht der Szene hinzugefügt werden
        this.controls = new Controls(this.camera, []);
        // EventExtension vorbereiten
        this.eventExtension = new EventExtension(this.controls);
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