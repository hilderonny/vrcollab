import {Mesh, MeshBasicMaterial, Raycaster, SphereGeometry, Vector2} from './three.module.js';
import camera from './camera.js';
import environment from './environment.js';
import { LogPanel } from './geometries.js';

var mouseSpeed = 2;
var moveSpeed = .1;

var controls = {
    
    forward: 0,
    sideward: 0,
    clickableobjects: [],
    teleporttargets: [],
    mouseVector: null,
    raycaster: null,
    hoverlisteners: [],
    clicklisteners: [],
    pointerSphere: null,
    intersection: null,

    init: function (renderer) {
        var deviceType = 'desktop';
        if (navigator.appVersion.indexOf('OculusBrowser') >= 0) {
            deviceType = 'xr';
        } else if (
            navigator.appVersion.indexOf('Android') >= 0 ||
            navigator.appVersion.indexOf('iPad') >= 0 ||
            navigator.appVersion.indexOf('iPhone') >= 0
        ) {
            deviceType = 'mobile';
        }
        console.log(deviceType);

        var startX, startY, mouseDown;
        this.mouseVector = new Vector2();
        this.raycaster = new Raycaster();
        this.raycaster.near = .1;
        this.raycaster.far = 20;
        var mouseMove = (e) => {
            this.mouseVector.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	        this.mouseVector.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
            if (mouseDown) {
                var deltaX = e.clientX - startX;
                var deltaY = e.clientY - startY;
                var min = Math.min(window.innerWidth, window.innerHeight);
                camera.cam3.rotation.x -= deltaY/min * mouseSpeed;
                camera.head.rotation.y -= deltaX/min * mouseSpeed;
                startX = e.clientX; startY = e.clientY;
            }
        };
        renderer.domElement.addEventListener('mousedown', function(event) {
            // React only to right mouse button for movement
            if (event.button == 2) {
                startX = event.clientX; startY = event.clientY;
                mouseDown = true;
            }
        });
        renderer.domElement.addEventListener('mouseup', () => {
            if (event.button == 2) {
                mouseDown = false;
            }
            if (event.button == 0 && this.intersection) {
                this.intersection.object.click(this.intersection);
            }
        });
        renderer.domElement.addEventListener('contextmenu', function(event) {
            event.preventDefault();
        });
        renderer.domElement.addEventListener('mousemove', mouseMove);
        renderer.domElement.addEventListener('keydown', (event) => {
            switch(event.key) {
                case 'w': this.forward = -1; break;
                case 'a': this.sideward = -1; break;
                case 's': this.forward = 1; break;
                case 'd': this.sideward = 1; break;
            }
        });
        renderer.domElement.addEventListener('keyup', (event) => {
            switch(event.key) {
                case 'w': this.forward = 0; break;
                case 'a': this.sideward = 0; break;
                case 's': this.forward = 0; break;
                case 'd': this.sideward = 0; break;
            }
        });
        renderer.domElement.tabIndex = 0;
        this.pointerSphere = new Mesh(
            new SphereGeometry(.1),
            new MeshBasicMaterial({ color: 0xff0000 })
        );
        this.pointerSphere.visible = false;
        environment.scene.add(this.pointerSphere);
    },

    update: function() {
        if (this.forward !== 0) camera.head.translateZ(this.forward * moveSpeed);
        if (this.sideward !== 0) camera.head.translateX(this.sideward * moveSpeed);
        if (this.clickableobjects.length) {
            this.raycaster.setFromCamera( this.mouseVector, camera.cam3 ); // https://threejs.org/docs/#api/en/core/Raycaster
            var intersects = this.raycaster.intersectObjects( this.clickableobjects );
            if (intersects.length) {
                this.intersection = intersects[0];
                this.pointerSphere.visible = true;
                this.pointerSphere.position.copy(this.intersection.point);
                LogPanel.lastPanel.log(this.intersection.distance);
            } else {
                this.intersection = null;
                this.pointerSphere.visible = false;
            }
        }
    },

    addTeleportTarget: function(target) {
        this.teleporttargets.push(target);
        this.clickableobjects.push(target);
        target.click = function(intersection) {
            camera.head.position.copy(intersection.point);
        };
    },

};

export default controls;