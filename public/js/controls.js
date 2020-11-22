import { Raycaster, Vector2 } from './lib/three.module.js';

class Controls {

    constructor(camera, raycastableObjects) {
        // An window werden die Event Listener für Maus, Touch, etc. gebunden
        // Alle Objekte, die für Raycaster in Frage kommen
        this.raycastableObjects = raycastableObjects ? raycastableObjects : [];
        // Kamera brauchen wir für Raycasting später
        this.camera = camera;
        // Event Listeners vorbereiten
        this.eventListeners = {};
        // Plattform ermitteln
        if (navigator.appVersion.indexOf('OculusBrowser') >= 0) {
            this.initXR();
        } else if (
            navigator.appVersion.indexOf('Android') >= 0 ||
            navigator.appVersion.indexOf('iPad') >= 0 ||
            navigator.appVersion.indexOf('iPhone') >= 0 ||
            navigator.maxTouchPoints > 0
        ) {
            this.initTouch();
        } else {
            this.initDesktop();
        }
        // Raycaster initialisieren
        this.raycaster = new Raycaster();
        this.raycaster.near = .05; // Abstand mindestens 5 cm
        this.raycaster.far = 20; // Höchstens 20 meter entfernt
    }

    addEventListener(event, listener) {
        if (!this.eventListeners[event]) this.eventListeners[event] = [];
        this.eventListeners[event].push(listener);
    }

    checkIntersection() {
        let intersects = this.raycaster.intersectObjects(this.raycastableObjects);
        if (intersects.length < 1) return;
        this.sendEvent(Controls.EventType.PointerUpdate, intersects[0]);
    }

    initDesktop() {
        this.mouseVector = new Vector2();
        this.mouseSpeed = 2;
        this.platform = Controls.Platform.Desktop;
        // Tastaturereignisse
        window.addEventListener('keydown', event => {
            this.sendEvent(Controls.EventType.ButtonDown, { buttonType: Controls.ButtonType.Keyboard, button: event.code, key: event.key });
        });
        window.addEventListener('keyup', event => {
            this.sendEvent(Controls.EventType.ButtonUp, { buttonType: Controls.ButtonType.Keyboard, button: event.code, key: event.key });
        });
        // Mausknöpfe
        window.addEventListener('mousedown', event => {
            if (event.button == 2) {
                this.mouseStartX = event.clientX;
                this.mouseStartY = event.clientY;
                this.mouseDown = true;
            }
            this.sendEvent(Controls.EventType.ButtonDown, { buttonType: Controls.ButtonType.Mouse, button: event.button });
        });
        window.addEventListener('mouseup', event => {
            if (event.button == 2) {
                this.mouseDown = false;
            }
            this.sendEvent(Controls.EventType.ButtonUp, { buttonType: Controls.ButtonType.Mouse, button: event.button });
        });
        // Kontextmenü deaktivieren
        window.addEventListener('contextmenu', event => event.preventDefault() );
        // Mausbewegung
        window.addEventListener('mousemove', event => {
            this.mouseVector.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	        this.mouseVector.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
            if (this.mouseDown) {
                var deltaX = e.clientX - this.mouseStartX;
                var deltaY = e.clientY - this.mouseStartY;
                var min = Math.min(window.innerWidth, window.innerHeight);
                this.camera.cam3.rotation.x -= deltaY/min * this.mouseSpeed;
                this.camera.head.rotation.y -= deltaX/min * this.mouseSpeed;
                this.mouseStartX = e.clientX;
                this.mouseStartY = e.clientY;
            } else {
                this.raycaster.setFromCamera(this.mouseVector, this.camera.cam3);
                this.checkIntersection();
            }
        });
        // Ready melden
        this.sendEvent(Controls.EventType.Ready, { platform: this.platform });
    }

    initTouch() {
        this.platform = Controls.Platform.Touch;
    }

    initXR() {

    }

    sendEvent(eventType, data) {
        let listeners = this.eventListeners[eventType];
        if (listeners) {
            listeners.forEach(listener => listener(eventType, data));
        }
    }

}

Controls.ButtonType = {
    Keyboard: 'ControlsButtonTypeKeyboard',
    Mouse: 'ControlsButtonTypeMouse',
    Touch: 'ControlsButtonTypeTouch',
    XRController: 'ControlsButtonTypeXRController',
}

Controls.EventType = {
    ButtonDown: 'ControlsEventTypeButtonDown',
    ButtonUp: 'ControlsEventTypeButtonUp',
    PointerEnter: 'ControlsEventTypePointerEnter',
    PointerLeave: 'ControlsEventTypePointerLeave',
    PointerUpdate: 'ControlsEventTypePointerUpdate',
    Ready: 'ControlsEventTypeReady',
};

Controls.Platform = {
    Desktop: 'ControlsPlatformDesktop',
    Touch: 'ControlsPlatformTouch',
    XR1: 'ControlsPlatformXR1',
    XR2: 'ControlsPlatformXR2',
    Hand: 'ControlsPlatformHand',
}

export { Controls }