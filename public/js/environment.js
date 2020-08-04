import {BackSide, BoxGeometry, DirectionalLight, Mesh, MeshBasicMaterial, MeshPhongMaterial, PlaneGeometry, Scene, SphereGeometry} from './three.module.js';
import controls from './controls.js';

var sceneRadius = 100;

var environment = {

    scene: null,
    ground: null,

    init: function () {
        this.scene = new Scene();
        // Ground
        this.ground = new Mesh(
            new PlaneGeometry(sceneRadius * 2, sceneRadius * 2, 1, 1),
            new MeshBasicMaterial({ color: 0x4caf50 })
        );
        this.ground.rotation.x = -Math.PI / 2;
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
        // Geometry
        var cube = new Mesh(
            new BoxGeometry(),
            new MeshPhongMaterial({ color: 0xffeb3b, emissive: 0x484210 })
        );
        cube.position.y = .5;
        cube.position.z = -5;
        this.scene.add(cube);
    },

};

export default environment;