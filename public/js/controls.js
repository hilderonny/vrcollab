import {AdditiveBlending, BufferGeometry, Float32BufferAttribute, Line, LineBasicMaterial, Matrix4, Mesh, MeshBasicMaterial, Raycaster, SphereGeometry, Vector2} from './three.module.js';
import { XRControllerModelFactory } from './XRControllerModelFactory.js';

import camera from './camera.js';
import environment from './environment.js';
import { LogPanel } from './geometries.js';

var desktopControls = {

    mouseSpeed: 2,
    moveSpeed: .1,
        
    forward: 0,
    sideward: 0,
    mouseVector: null,
    intersection: null,

    init: function(renderer) {
        var startX, startY, mouseDown;
        this.mouseVector = new Vector2();
        var mouseMove = (e) => {
            this.mouseVector.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	        this.mouseVector.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
            if (mouseDown) {
                var deltaX = e.clientX - startX;
                var deltaY = e.clientY - startY;
                var min = Math.min(window.innerWidth, window.innerHeight);
                camera.cam3.rotation.x -= deltaY/min * this.mouseSpeed;
                camera.head.rotation.y -= deltaX/min * this.mouseSpeed;
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
    },

    update: function() {
        if (this.forward !== 0) camera.head.translateZ(this.forward * this.moveSpeed);
        if (this.sideward !== 0) camera.head.translateX(this.sideward * this.moveSpeed);
    },

    updateRaycaster: function(raycaster) {
        raycaster.setFromCamera( this.mouseVector, camera.cam3 ); // https://threejs.org/docs/#api/en/core/Raycaster
    },

    handleTeleport: function(intersection) {
        camera.head.position.copy(intersection.point);
    },

};

var mobileControls = {

    isMoving: false,
    moveSpeed: 1,
    intersection: null,

    init: function(renderer) {
        var startX, startY, touchDown;
        this.touchVector = new Vector2();
        renderer.domElement.addEventListener('touchstart', (event) => {
            event.preventDefault();
            startX = event.touches[0].clientX;
            startY = event.touches[0].clientY;
            touchDown = true;
        }, false);
        renderer.domElement.addEventListener('touchmove', (event) => {
            event.preventDefault();
            var touchPoint = event.touches[0];
            this.touchVector.x = ( touchPoint.clientX / window.innerWidth ) * 2 - 1;
	        this.touchVector.y = - ( touchPoint.clientY / window.innerHeight ) * 2 + 1;
            var deltaX = touchPoint.clientX - startX;
            var deltaY = touchPoint.clientY - startY;
            if (!this.isMoving) this.isMoving = deltaX !== 0 || deltaY !== 0;
            var min = Math.min(window.innerWidth, window.innerHeight);
            camera.cam3.rotation.x += deltaY/min * this.moveSpeed;
            camera.head.rotation.y += deltaX/min * this.moveSpeed;
            startX = touchPoint.clientX; startY = touchPoint.clientY;
        }, false);
        renderer.domElement.addEventListener('touchend', (event) => {
            event.preventDefault();
            if (!this.isMoving && this.intersection) {
                this.intersection.object.click(this.intersection);
            }
            this.isMoving = false;
            touchDown = false;
        }, false);
    },

    update: function() {},

    updateRaycaster: function(raycaster) {
        raycaster.setFromCamera( this.touchVector, camera.cam3 );
    },

    handleTeleport: function(intersection) {
        camera.head.position.copy(intersection.point);
    },
};

var xrControls = {

    xrManager: null,
    controller: null,
    tempMatrix: new Matrix4(),
    intersection: null,
    xrInputSource: null,
    touchDown: false,

    init: function(renderer) {
        this.xrManager = renderer.xr;
        this.xrManager.enabled = true;
        var xrStartButton = document.createElement('vrbutton');
        xrStartButton.innerHTML = 'Enter VR';
        xrStartButton.addEventListener('click', async () => {
            var xrSession = await navigator.xr.requestSession('immersive-vr', { optionalFeatures: [ 'local-floor', 'bounded-floor', 'hand-tracking' ] });
            xrSession.addEventListener( 'end', () => {
                xrStartButton.style.display = 'flex';
            });
            console.log(xrSession);
            this.xrManager.setSession(xrSession);
            xrStartButton.style.display = 'none';
        });
        document.body.appendChild(xrStartButton);
        // Controller model
        var controllerModelFactory = new XRControllerModelFactory();
        var controllerGrip = this.xrManager.getControllerGrip( 0 );
        var controllerModel = controllerModelFactory.createControllerModel(controllerGrip);
        controllerGrip.add(controllerModel);
        camera.head.add(controllerGrip);
        // Controller und Ziellinie
        this.controller = this.xrManager.getController(0);
        this.controller.addEventListener('selectend', () => {
            LogPanel.lastPanel.log('selectend');
            if (this.intersection) {
                this.intersection.object.click(this.intersection);
            }
        });
        this.controller.addEventListener('connected', (evt) => {
            this.xrInputSource = evt.data;
            var isOculusGo = this.xrInputSource.profiles.includes('oculus-go');
            var geometry = new BufferGeometry();
            geometry.setAttribute( 'position', new Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
            geometry.setAttribute( 'color', new Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );
            var material = new LineBasicMaterial( { vertexColors: true, blending: AdditiveBlending } );
            this.controller.add(new Line( geometry, material ));
        });
        camera.head.add(this.controller);
    },

    update: function() {
        if (this.touchDown && !this.xrInputSource.gamepad.buttons[2].pressed) {
            this.touchDown = false;
            var dir = this.xrInputSource.gamepad.axes[0];
            if (Math.abs(dir) > .1) {
                LogPanel.lastPanel.log(dir);  
                camera.head.rotateY(Math.PI / 4 * (dir < 0 ? 1 : -1));
            }
        } else if (this.xrInputSource.gamepad.buttons[2].pressed) {
            this.touchDown = true;
        }
        //LogPanel.lastPanel.log(JSON.stringify(this.xrInputSource.gamepad.axes, null, 2));
        //for (var button of this.xrInputSource.gamepad.buttons) {
            //LogPanel.lastPanel.log(button.pressed + ' - ' + button.touched + ' - ' + button.value);
        //}
    },

    updateRaycaster: function(raycaster) {
        this.tempMatrix.identity().extractRotation(this.controller.matrixWorld);
        raycaster.ray.origin.setFromMatrixPosition(this.controller.matrixWorld);
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);
    },

    handleTeleport: function(intersection) {
        camera.head.position.copy(intersection.point);
    },
};

var controls = {

    controlsInstance: null,
    teleporttargets: [],
    clickableobjects: [],
    pointerSphere: null,
    raycaster: null,

    init: function(renderer) {
        var deviceType = 'desktop';
        if (navigator.appVersion.indexOf('OculusBrowser') >= 0 || (navigator.appVersion.indexOf('Windows') >= 0 && navigator.xr)) {
            deviceType = 'xr';
        } else if (
            navigator.appVersion.indexOf('Android') >= 0 ||
            navigator.appVersion.indexOf('iPad') >= 0 ||
            navigator.appVersion.indexOf('iPhone') >= 0 ||
            navigator.maxTouchPoints > 0
        ) {
            deviceType = 'mobile';
        }
        console.log(deviceType);
        switch(deviceType) {
            case 'desktop': this.controlsInstance = desktopControls; break;
            case 'mobile': this.controlsInstance = mobileControls; break;
            case 'xr': this.controlsInstance = xrControls; break;
        }
        this.controlsInstance.init(renderer);
        this.pointerSphere = new Mesh(
            new SphereGeometry(.1),
            new MeshBasicMaterial({ color: 0xff0000 })
        );
        this.pointerSphere.visible = false;
        environment.scene.add(this.pointerSphere);
        this.raycaster = new Raycaster();
        this.raycaster.near = .1;
        this.raycaster.far = 20;
    },

    update: function() {
        this.controlsInstance.update();
        if (this.clickableobjects.length) {
            this.controlsInstance.updateRaycaster(this.raycaster);
            var intersects = this.raycaster.intersectObjects( this.clickableobjects );
            if (intersects.length) {
                this.intersection = intersects[0];
                this.pointerSphere.visible = true;
                this.pointerSphere.position.copy(this.intersection.point);
                //LogPanel.lastPanel.log(this.intersection.distance);
            } else {
                this.intersection = null;
                this.pointerSphere.visible = false;
            }
            this.controlsInstance.intersection = this.intersection;
        }
    },

    addTeleportTarget: function (target) {
        this.teleporttargets.push(target);
        this.clickableobjects.push(target);
        target.click = (intersection) => {
            this.controlsInstance.handleTeleport(intersection);
        };
    },

}

export default controls;