import {BackSide, BoxGeometry, DirectionalLight, Mesh, MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry, Scene, SphereGeometry} from './lib/three.module.js';
import controls from './controls.js';
import {EventMesh, LogPanel} from './geometries.js';

var sceneRadius = 100;

var environment = {

    scene: null,
    ground: null,

    init: function () {
        this.scene = new Scene();
        // Ground
        this.ground = new EventMesh(
            new PlaneGeometry(sceneRadius * 2, sceneRadius * 2, 1, 1),
            new MeshBasicMaterial({ color: 0x4caf50 })
        );
        this.ground.rotation.x = -Math.PI / 2;
        this.ground.addEventListener(EventMesh.EventType.PointerEnter, () => {
            LogPanel.lastPanel.log('Enter Ground');
        });
        this.ground.addEventListener(EventMesh.EventType.PointerLeave, () => {
            LogPanel.lastPanel.log('Leave Ground');
        });
        this.scene.add(this.ground);
        controls.addTeleportTarget(this.ground);
        // Sky
        var sky = new Mesh(
            new SphereGeometry(sceneRadius, 50, 50, 0, 2 * Math.PI),
            new MeshBasicMaterial({
                side: BackSide,
                depthWrite: false,
                color: 0x00bcd4
            })
        );
        this.scene.add(sky);
        // Sunlight
        var sunLight = new DirectionalLight( 'rgb(255,255,255)', 1 );
        this.scene.add(sunLight);
        // Cube
        var cube = new EventMesh(
            new BoxGeometry(),
            new MeshPhongMaterial({ color: 0xffeb3b, emissive: 0x484210 })
        );
        cube.position.y = .5;
        cube.position.z = -5;
        cube.addEventListener(EventMesh.EventType.PointerEnter, () => {
            LogPanel.lastPanel.log('Enter Cube');
        });
        cube.addEventListener(EventMesh.EventType.PointerLeave, () => {
            LogPanel.lastPanel.log('Leave Cube');
        });
        cube.enableForRayCaster = true;
        this.scene.add(cube);
    },

};

export default environment;