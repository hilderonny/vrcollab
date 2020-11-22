import { Raycaster } from './lib/three.module.js';

class Controls {

    constructor(camera) {
        // An window werden die Event Listener für Maus, Touch, etc. gebunden
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
        window.addEventListener('keydown', event => {
            this.sendEvent(Controls.EventType.ButtonDown, { buttonType: Controls.ButtonType.Keyboard, button: event.code, key: event.key });
        });
        window.addEventListener('keyup', event => {
            this.sendEvent(Controls.EventType.ButtonUp, { buttonType: Controls.ButtonType.Keyboard, button: event.code, key: event.key });
        });
        // Mausknöpfe
        window.addEventListener('mousedown', event => {
            this.sendEvent(Controls.EventType.ButtonDown, { buttonType: Controls.ButtonType.Mouse, button: event.button });
        });
        window.addEventListener('mouseup', event => {
            this.sendEvent(Controls.EventType.ButtonUp, { buttonType: Controls.ButtonType.Mouse, button: event.button });
        });
        // Kontextmenü deaktivieren
        window.addEventListener('contextmenu', event => event.preventDefault() );
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