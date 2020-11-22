import { Raycaster } from './lib/three.module.js';

class Controls {

    constructor(domElement, camera) {
        super();
        // An das DOM-Element werden die Event Listener für Maus, Touch, etc. gebunden
        this.domElement = domElement;
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
        console.log(this.platform);
        // Raycaster initialisieren
        this.raycaster = new Raycaster();
        this.raycaster.near = .1;
        this.raycaster.far = 20;
    }

    addEventListener(event, listener) {
        if (!this.eventListeners[event]) this.eventListeners[event] = [];
        this.eventListeners[event].push(listener);
    }

    initDesktop() {
        this.platform = Controls.Platform.Desktop;
        // Tastaturereignisse
        this.domElement.addEventListener('keydown', event => {
            this.sendEvent(Controls.EventType.ButtonDown, { buttonType: Controls.ButtonType.Keyboard, button: event.keyCode });
        });
        renderer.domElement.addEventListener('keyup', event => {
            this.sendEvent(Controls.EventType.ButtonUp, { buttonType: Controls.ButtonType.Keyboard, button: event.keyCode });
        });
        // Mausknöpfe
        this.domElement.addEventListener('mousedown', event => {
            this.sendEvent(Controls.EventType.ButtonDown, { buttonType: Controls.ButtonType.Mouse, button: event.button });
        });
        this.domElement.addEventListener('mouseup', event => {
            this.sendEvent(Controls.EventType.ButtonUp, { buttonType: Controls.ButtonType.Mouse, button: event.button });
        });
        // Kontextmenü deaktivieren
        this.domElement.addEventListener('contextmenu', event => event.preventDefault() );
    }

    initTouch() {
        this.platform = Controls.Platform.Touch;
    }

    initXR() {

    }

    sendEvent(eventType, data) {
        let listeners = this.eventListeners[eventType];
        if (listeners) {
            listeners.forEach(listener => listener(data));
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