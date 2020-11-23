import { Raycaster, Vector2 } from './lib/three.module.js';

/**
 * Verarbeitet alle Eingaben auf den verschiedenen Plattformen und versendet Events.
 * 
 * Auf dem Desktop werden Bewegungen mit der Tastatur (WASD, Pfeiltasten) und der Maus
 * (Rumgucken) verarbeitet.
 * Sollen die Tastatureingaben anderweitig verarbeitet werden, muss die Eigenschaft
 * "processKeyboard" auf "false" gesetzt werden.
 * 
 * Auf Touch-Screens wird die Kameradrehung durchgeführt, wenn man auf den Screen drückt und
 * zieht.
 * 
 * Auf VR-Brillen muss die Interaktion auf einer anderen Ebene erfolgen.
 * Für VR wird ein DOM-Element mit der ID "vrbutton" erstellt, falls es auf der Seite noch keinen
 * gibt. Wenn es einen gibt, wird ein Event-Handler dran gehangen, der die XR-Session startet.
 * 
 * @example
 * let raycastableObjects = [];
 * let controls = new Controls(camera, raycastableObjects);
 * // Auf das Drücken von Knöpfen und Tasten reagieren
 * controls.addEventListener(Controls.EventType.ButtonDown, ...);
 * // Auf das LÖoslassen von Tasten und Knöpfen reagieren
 * controls.addEventListener(Controls.EventType.ButtonUp, ...);
 * // Zeiger-Updates auf raycastable Objects
 * controls.addEventListener(Controls.EventType.PointerUpdate, ...);
 * // Ereignis bei abschließender Initialisierung.
 * // Ab hier sind alle Controller bereit und es können 
 * // 3D Elemente an die Controller gehangen werden.
 * // Ist nur für XR relevant, weil auf Desktop und Touch 
 * // gleich nach Konstruktor-Aufruf alles bereit ist.
 * controls.addEventListener(Controls.EventType.Ready, ...);
 * // Zyklische Updates bei Tastaturbewegung
 * renderer.setAnimationLoop(function() {
 *   controls.processAnimationFrame();
 * });
 */
class Controls {

    /**
     * @param {*} camera Die Kamera wird auf Desktop und Touch bewegt
     * @param {*} raycastableObjects Array von Objekten, die auf Raycasting reagieren. Nur diese verursachen ein PointerUpdate Event.
     */
    constructor(camera, raycastableObjects) {
        // An window werden die Event Listener für Maus, Touch, etc. gebunden
        // Alle Objekte, die für Raycaster in Frage kommen
        this.raycastableObjects = raycastableObjects ? raycastableObjects : [];
        // Kamera brauchen wir für Raycasting später
        this.camera = camera;
        // Tastaturbewegung standardmäßig verarbeiten
        this.processKeyboard = true;
        this.forward = 0;
        this.sideward = 0;
        this.moveSpeed = .1;
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

    /**
     * Prüft den Zeiger auf alle raycastableObjects und sendet "PointerUpdate" - Events,
     * wenn es Treffer gibt.
     * Wird auf dem Dektop durch Mausbewegungen und auf dem Touchscreen durch Fingerwischen getriggert.
     * Auf XR-Geräten wird diese Funktion durch Controllerbewegungen getriggert, das aber nur höchstens
     * einmal je AnimationFrame.
     */
    checkIntersection() {
        let intersects = this.raycaster.intersectObjects(this.raycastableObjects);
        if (intersects.length < 1) return;
        this.sendEvent(Controls.EventType.PointerUpdate, intersects[0]);
    }

    /**
     * Initialisiert Tastatur und Maus, falls die Plattform Desktop ist
     */
    initDesktop() {
        this.mouseVector = new Vector2();
        this.mouseSpeed = 2;
        this.platform = Controls.Platform.Desktop;
        // Tastaturereignisse
        window.addEventListener('keydown', event => {
            this.sendEvent(Controls.EventType.ButtonDown, { buttonType: Controls.ButtonType.Keyboard, button: event.code, key: event.key });
            if (!this.processKeyboard) return;
            switch(event.code) {
                case 'KeyW': case 'ArrowUp': this.forward = -1; break;
                case 'KeyA': case 'ArrowLeft': this.sideward = -1; break;
                case 'KeyS': case 'ArrowDown': this.forward = 1; break;
                case 'KeyD': case 'ArrowRight': this.sideward = 1; break;
            }
        });
        window.addEventListener('keyup', event => {
            this.sendEvent(Controls.EventType.ButtonUp, { buttonType: Controls.ButtonType.Keyboard, button: event.code, key: event.key });
            if (!this.processKeyboard) return;
            switch(event.code) {
                case 'KeyW': case 'ArrowUp': this.forward = 0; break;
                case 'KeyA': case 'ArrowLeft': this.sideward = 0; break;
                case 'KeyS': case 'ArrowDown': this.forward = 0; break;
                case 'KeyD': case 'ArrowRight': this.sideward = 0; break;
            }
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
                var deltaX = event.clientX - this.mouseStartX;
                var deltaY = event.clientY - this.mouseStartY;
                var min = Math.min(window.innerWidth, window.innerHeight);
                this.camera.cam3.rotation.x -= deltaY/min * this.mouseSpeed;
                this.camera.head.rotation.y -= deltaX/min * this.mouseSpeed;
                this.mouseStartX = event.clientX;
                this.mouseStartY = event.clientY;
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
        // TODO: Implementieren
    }

    initXR() {
        // TODO: Implementieren
    }

    /**
     * Wird einmal je AnimationFrame aufgerufen.
     * Auf Desktop wird hierbei die Vor- und Zurückbewegung gemacht. Dazu wird die
     * Kamera bewegt.
     * Sollte von außerhalb aufgerufen werden.
     * @example
     * renderer.setAnimationLoop(function() {
     *   controls.processAnimationFrame();
     * });
     */
    processAnimationFrame() {
        // Tastaturbewegung
        if (this.forward !== 0) this.camera.head.translateZ(this.forward * this.moveSpeed);
        if (this.sideward !== 0) this.camera.head.translateX(this.sideward * this.moveSpeed);
    }

    /**
     * Verschickt Events an alle Listener. Ist eine Hilfsfunktion für andere
     * Funktionen hier drin.
     */
    sendEvent(eventType, data) {
        let listeners = this.eventListeners[eventType]; // Nur die Listener, die auf das Event reagieren
        if (listeners) {
            listeners.forEach(listener => listener(eventType, data));
        }
    }

}

/**
 * Wird bei ButtonUp und ButtonDown Events als "buttonType" Attribut geschickt, um die Art der Quelle zu beschreiben.
 */
Controls.ButtonType = {
    /**
     * Event-Daten enthalten zusätzlich als "button" den keyCode (z.B. 65 bei "A" und "a")
     * und in "key" das Zeichen der Taste ("A" vs. "a")
     */
    Keyboard: 'ControlsButtonTypeKeyboard',
    /**
     * Im "button" Attribut ist die Maustaste drin (0 = links, 1 = Mitte, 2 = Rechts)
     */
    Mouse: 'ControlsButtonTypeMouse',
    Touch: 'ControlsButtonTypeTouch',
    XRController: 'ControlsButtonTypeXRController',
}

Controls.EventType = {
    ButtonDown: 'ControlsEventTypeButtonDown',
    ButtonUp: 'ControlsEventTypeButtonUp',
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