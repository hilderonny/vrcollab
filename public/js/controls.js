import {AdditiveBlending, BufferGeometry, Float32BufferAttribute, Line, LineBasicMaterial, Matrix4, Mesh, MeshBasicMaterial, Raycaster, SphereGeometry, Vector2} from './lib/three.module.js';
import { XRControllerModelFactory } from './lib/XRControllerModelFactory.js';

import camera from './camera.js';
import environment from './environment.js';
import { EventMesh, LogPanel, MenuPanel } from './geometries.js';

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
        renderer.domElement.addEventListener('mousedown', (event) => {
            // React only to right mouse button for movement
            if (event.button == 2) {
                startX = event.clientX; startY = event.clientY;
                mouseDown = true;
            }
            if (event.button == 0 && this.intersection) {
                this.intersection.object.sendEvent(EventMesh.EventType.ButtonDown, EventMesh.ButtonCode.MouseLeft, this.intersection.point);
            }
        });
        renderer.domElement.addEventListener('mouseup', () => {
            if (event.button == 2) {
                mouseDown = false;
            }
            if (event.button == 0 && this.intersection) {
                this.intersection.object.sendEvent(EventMesh.EventType.ButtonUp, EventMesh.ButtonCode.MouseLeft, this.intersection.point);
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

};

var mobileControls = {

    isMoving: false,
    moveSpeed: 1,
    intersection: null,

    init: function(renderer) {
        var startX, startY;
        this.touchVector = new Vector2();
        renderer.domElement.addEventListener('touchstart', (event) => {
            event.preventDefault();
            var touchPoint = event.touches[0];
            this.touchVector.x = ( touchPoint.clientX / window.innerWidth ) * 2 - 1;
	        this.touchVector.y = - ( touchPoint.clientY / window.innerHeight ) * 2 + 1;
            startX = touchPoint.clientX;
            startY = touchPoint.clientY;
            if (this.intersection) {
                this.intersection.object.sendEvent(EventMesh.EventType.ButtonDown, EventMesh.ButtonCode.TouchScreen, this.intersection.point);
            }
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
                this.intersection.object.sendEvent(EventMesh.EventType.ButtonUp, EventMesh.ButtonCode.TouchScreen, this.intersection.point);
            }
            this.isMoving = false;
        }, false);
    },

    update: function() {},

    updateRaycaster: function(raycaster) {
        raycaster.setFromCamera( this.touchVector, camera.cam3 );
    },

};

var oculusGoControls = {

    tempMatrix: new Matrix4(),
    controller: null,
    touchDown: false,
    intersection: null,

    init: function(xrManager) {
        // Controller model
        var controllerModelFactory = new XRControllerModelFactory();
        var controllerGrip = xrManager.getControllerGrip(0);
        var controllerModel = controllerModelFactory.createControllerModel(controllerGrip);
        controllerGrip.add(controllerModel);
        camera.head.add(controllerGrip);
        // Controller und Ziellinie
        this.controller = xrManager.getController(0);
        this.controller.addEventListener('selectend', () => {
            if (this.intersection) {
                this.intersection.object.click(this.intersection); // TODO: Auf Event ButtonUp umstellen
            }
        });
        this.controller.addEventListener('connected', (evt) => {
            this.controller.xrInputSource = evt.data;
            var geometry = new BufferGeometry();
            geometry.setAttribute( 'position', new Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
            geometry.setAttribute( 'color', new Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );
            var material = new LineBasicMaterial( { vertexColors: true, blending: AdditiveBlending } );
            this.controller.add(new Line( geometry, material ));
        });
        camera.head.add(this.controller);
        LogPanel.lastPanel.log('Go');
    },

    update: function() {
        if (this.touchDown && !this.controller.xrInputSource.gamepad.buttons[2].pressed) {
            this.touchDown = false;
            var dir = this.controller.xrInputSource.gamepad.axes[0];
            if (Math.abs(dir) > .1) {
                camera.head.rotateY(Math.PI / 4 * (dir < 0 ? 1 : -1));
            }
        } else if (this.controller.xrInputSource && this.controller.xrInputSource.gamepad.buttons[2].pressed) {
            this.touchDown = true;
        }
    },

    updateRaycaster: function(raycaster) {
        this.tempMatrix.identity().extractRotation(this.controller.matrixWorld);
        raycaster.ray.origin.setFromMatrixPosition(this.controller.matrixWorld);
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);
    },

};

var oculusQuestControls = {

    leftController: null,
    rightController: null,

    init: function(xrManager) {
        // Controller model
        var controllerModelFactory = new XRControllerModelFactory();
        for (var i = 0; i < 2; i++) {
            var controller = xrManager.getController(i);
            if (i === 1) {
                var controllerGrip = xrManager.getControllerGrip(i);
                var controllerModel = controllerModelFactory.createControllerModel(controllerGrip);
                controllerGrip.add(controllerModel);
                camera.head.add(controllerGrip);
                // Rechter Controller und Ziellinie
                this.rightController = controller;
                this.rightController.addEventListener('connected', (evt) => {
                    this.rightController.xrInputSource = evt.data;
                    var geometry = new BufferGeometry(); // Ziellinie
                    geometry.setAttribute( 'position', new Float32BufferAttribute( [ 0, 0, 0, 0, 0, - 1 ], 3 ) );
                    geometry.setAttribute( 'color', new Float32BufferAttribute( [ 0.5, 0.5, 0.5, 0, 0, 0 ], 3 ) );
                    var material = new LineBasicMaterial( { vertexColors: true, blending: AdditiveBlending } );
                    this.rightController.add(new Line( geometry, material ));
                });
                this.rightController.tempMatrix = new Matrix4();
            } else {
                // Menü an linkem Handgelenk
                this.leftController = controller;
                this.leftController.addEventListener('connected', (evt) => {
                    this.leftController.xrInputSource = evt.data;
                    //var scale = 2;
                    //var menupanel = new MenuPanel(scale * .28, scale * .192);
                    var scale = .0005;
                    var menupanel = new MenuPanel(scale * 585, scale * 546);
                    window.menupanel = menupanel;
                    menupanel.rotateY(Math.PI/8);
                    menupanel.rotateZ(Math.PI/8);
                    menupanel.rotateX(-Math.PI/4);
                    this.leftController.add(menupanel);
                });
            }
            camera.head.add(controller);
        }
        LogPanel.lastPanel.log('Quest');
    },

    update: function() {
        // Buttons: 0=Trigger, 1=Grip, 2=?, 3=Stick, 4=A, 5=B
        var triggerPressed = this.rightController.xrInputSource.gamepad.buttons[0].pressed;
        if (this.rightController.triggerDown && !triggerPressed) {
            this.rightController.triggerDown = false;
            if (this.intersection) {
                this.intersection.object.click(this.intersection); // TODO: Auf Event ButtonUp umstellen
            }
        } else if (this.rightController.xrInputSource && triggerPressed) {
            this.rightController.triggerDown = true;
        }
    },

    updateRaycaster: function(raycaster) {
        this.rightController.tempMatrix.identity().extractRotation(this.rightController.matrixWorld);
        raycaster.ray.origin.setFromMatrixPosition(this.rightController.matrixWorld);
        raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.rightController.tempMatrix);
    },

};

var xrControls = {

    init: function(renderer) {
        var xrManager = renderer.xr;
        xrManager.enabled = true;
        var xrStartButton = document.createElement('vrbutton');
        xrStartButton.innerHTML = 'Enter VR';
        xrStartButton.addEventListener('click', async () => {
            var xrSession = await navigator.xr.requestSession('immersive-vr', { optionalFeatures: [ 'local-floor', 'bounded-floor', 'hand-tracking' ] });
            xrSession.addEventListener( 'end', () => {
                xrStartButton.style.display = 'flex';
            });
            xrSession.addEventListener('inputsourceschange', () => {
                if (xrSession.loaded) return;
                xrSession.loaded = true;                
                LogPanel.lastPanel.log('Anzahl Controller: ' + xrSession.inputSources.length);
                if (xrSession.inputSources.length === 1) { // Oculus Go und Quest unterscheiden
                    oculusGoControls.init(xrManager);
                    controls.controlsInstance = oculusGoControls;
                } else {
                    oculusQuestControls.init(xrManager);
                    controls.controlsInstance = oculusQuestControls;
                }
            });
            xrManager.setSession(xrSession);
            xrStartButton.style.display = 'none';
        });
        document.body.appendChild(xrStartButton);
    },

};

var controls = {

    controlsInstance: null,
    teleporttargets: [],
    pointerSphere: null,
    raycaster: null,

    init: function(renderer) {
        var deviceType = 'desktop';
        if (navigator.appVersion.indexOf('OculusBrowser') >= 0 /*|| (navigator.appVersion.indexOf('Windows') >= 0 && navigator.xr) || (navigator.appVersion.indexOf('Mac OS X') >= 0 && navigator.xr)*/) {
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
        this.controlsInstance.update?.();
        if (EventMesh.AllRaycasterMeshes.length) {
            this.controlsInstance.updateRaycaster?.(this.raycaster); // https://ponyfoo.com/articles/null-propagation-operator
            var intersects = this.raycaster.intersectObjects(EventMesh.AllRaycasterMeshes);
            if (intersects.length) {
                var alreadyIntersected = this.intersection && (this.intersection.object === intersects[0].object);
                if (this.intersection && !alreadyIntersected) this.intersection.object.sendEvent(EventMesh.EventType.PointerLeave);
                this.intersection = intersects[0];
                this.pointerSphere.visible = true;
                this.pointerSphere.position.copy(this.intersection.point);
                if (!alreadyIntersected) this.intersection.object.sendEvent(EventMesh.EventType.PointerEnter);
            } else {
                if (this.intersection) this.intersection.object.sendEvent(EventMesh.EventType.PointerLeave);
                this.intersection = null;
                this.pointerSphere.visible = false;
            }
            this.controlsInstance.intersection = this.intersection;
        }
    },

}

export default controls;