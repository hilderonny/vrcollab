import { BackSide, DirectionalLight, Mesh, MeshBasicMaterial, PlaneGeometry, Scene, SphereGeometry, Vector3 } from '../js/lib/three.module.js';
import { TeleportMesh } from './geometries.js';

var sceneRadius = 100;

var environment = {

    scene: null,
    ground: null,

    init: function () {
        this.scene = new Scene();
        // Ground
        this.ground = new TeleportMesh(
            new PlaneGeometry(sceneRadius * 2, sceneRadius * 2, 1, 1),
            new MeshBasicMaterial({ color: 0x4caf50 })
        );
        this.ground.rotation.x = -Math.PI / 2;
        this.scene.add(this.ground);
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
        sunLight.position.x = -.7;
        sunLight.position.z = .5;
        this.scene.add(sunLight);
    },

};

export default environment;