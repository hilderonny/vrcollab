import { Matrix4, Raycaster, Vector2 } from './lib/three.module.js';
import { XRControllerModelFactory } from './lib/XRControllerModelFactory.js';

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
     * @param {Camera} camera Die Kamera wird auf Desktop und Touch bewegt
     * @param {WebGLRenderer} renderer Renderer-Instanz. Wird für XR benötigt, um in XR-Modus umzuschalten.
     * @param {*} raycastableObjects Array von Objekten, die auf Raycasting reagieren. Nur diese verursachen ein PointerUpdate Event.
     */
    constructor(camera, renderer, raycastableObjects) {
        this.renderer = renderer;
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
        // Aktuelle Intersection für Leave-Events merken
        this.currentIntersection = null;
    }

    addEventListener(event, listener) {
        if (!this.eventListeners[event]) this.eventListeners[event] = [];
        this.eventListeners[event].push(listener);
    }

    /**
     * Prüft den Zeiger auf alle raycastableObjects und sendet "PointerUpdate" - Events,
     * wenn es Treffer gibt.
     * Wird auf dem Dektop durch Mausbewegungen und auf dem Touchscreen durch Fingerwischen oder Tippen getriggert.
     * Auf XR-Geräten wird diese Funktion durch Controllerbewegungen getriggert, das aber nur höchstens
     * einmal je AnimationFrame.
     */
    checkIntersection() {
        let intersects = this.raycaster.intersectObjects(this.raycastableObjects);
        if (intersects.length < 1) {
            if (this.currentIntersection) {
                this.sendEvent(Controls.EventType.PointerLeave, this.currentIntersection);
            }
            this.currentIntersection = null;
            return;
        } else {
            let intersection = intersects[0];
            if (this.currentIntersection && this.currentIntersection.object !== intersection.object) {
                this.sendEvent(Controls.EventType.PointerLeave, this.currentIntersection);
            }
            this.currentIntersection = intersection;
            this.sendEvent(Controls.EventType.PointerUpdate, this.currentIntersection);
        }
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

    /**
     * Initialisiert Touch-Eingabe auf mobilen Geräten
     */
    initTouch() {
        this.platform = Controls.Platform.Touch;
        this.touchVector = new Vector2();
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchIsMoving = false;
        this.touchMoveSpeed = 1; // Sensibilität der Kamera beim Ziehen
        // Generell drauf drücken, wir wissen hier noch nicht, ob es ein einfaches Tippen oder ein Ziehen ist
        window.addEventListener('touchstart', event => {
            let touchPoint = event.touches[0]; // Es interessiert nur ein Finger
            this.touchVector.x = ( touchPoint.clientX / window.innerWidth ) * 2 - 1;
            this.touchVector.y = - ( touchPoint.clientY / window.innerHeight ) * 2 + 1;
            // Startpunkt merken, um später zu erkennen, ob man nur gedrückt oder gezogen hat
            this.touchStartX = touchPoint.clientX;
            this.touchStartY = touchPoint.clientY;
            // Generell Touch Down - Event schicken und Raycasting durchführen.
            // Der Consumer muss entscheiden, ob er was damit macht
            this.raycaster.setFromCamera(this.touchVector, this.camera.cam3);
            this.checkIntersection();
            // Erst jetzt Button Event schicken, damit Consumer bereits das Ziel kennt
            this.sendEvent(Controls.EventType.ButtonDown, { buttonType: Controls.ButtonType.Touch });
        }, false);
        // Beim Ziehen soll sich die Kamera bewegen
        window.addEventListener('touchmove', event => {
            let touchPoint = event.touches[0];
            this.touchVector.x = ( touchPoint.clientX / window.innerWidth ) * 2 - 1;
	        this.touchVector.y = - ( touchPoint.clientY / window.innerHeight ) * 2 + 1;
            var deltaX = touchPoint.clientX - this.touchStartX;
            var deltaY = touchPoint.clientY - this.touchStartY;
            if (!this.touchIsMoving) this.touchIsMoving = deltaX !== 0 || deltaY !== 0; // Aha, wir ziehen also
            let min = Math.min(window.innerWidth, window.innerHeight);
            this.camera.cam3.rotation.x += deltaY/min * this.touchMoveSpeed;
            this.camera.head.rotation.y += deltaX/min * this.touchMoveSpeed;
            this.touchStartX = touchPoint.clientX;
            this.touchStartY = touchPoint.clientY;
        }, false);
        // Beim Loslassen nach dem Ziehen nix machen, ansonsten ButtonUp - Event 
        // und auch Raycasting auslösen
        window.addEventListener('touchend', () => {
            if (!this.touchIsMoving) {
                this.raycaster.setFromCamera(this.touchVector, this.camera.cam3);
                this.checkIntersection();
                // Erst jetzt Button Event schicken, damit Consumer bereits das Ziel kennt
                this.sendEvent(Controls.EventType.ButtonUp, { buttonType: Controls.ButtonType.Touch });
            }
            this.touchIsMoving = false;
        }, false);
        // Ready melden
        this.sendEvent(Controls.EventType.Ready, { platform: this.platform });
    }

    initXR() {
        let controllerModelFactory = new XRControllerModelFactory();
        // XR in ThreeJS aktivieren
        this.renderer.xr.enabled = true;
        // Die Buttons und Achsen werden über die GamePad API einmal je Frame abgefragt
        // Als Key wird die Hand des Controllers verwendet, falls die Connected Events mehrfach kommen
        this.inputSources = {};
        // 2 Controller pauschal vorbereiten, wir wissen hier aber noch nicht, welche Hand das sein wird
        for (let i = 0; i < 2; i++) {
            let controller = this.renderer.xr.getController(i);
            controller.grip = this.renderer.xr.getControllerGrip(i); // Verweis auf zugehörige Grip, die brauchen wir zum Objekte dranhängen
            // Controller zur Kamera hinzufügen
            this.camera.head.add(controller.grip);
            this.camera.head.add(controller);
            // Erst beim Connected Event wissen wir, welche Hand wir haben
            // Das Connected Event kommt eventuell mehrmals, wenn wir den Akku rausnehmen oder einsetzen, alos jedesmal neu initialisieren
            controller.addEventListener('connected', async (event) => {
                let inputSource = event.data;
                controller.xrInputSource = inputSource; // Brauchen wir später in Event-Handling
                inputSource.controller = controller;
                this.inputSources[inputSource.handedness] = inputSource;
                // Das Laden des Modells dauert ein paar Millisekunden.
                // Darum machen wir das asynchron, damit die Szene nicht ruckelt
                let controllerModel = await new Promise((resolve) => {
                    let model = controllerModelFactory.createControllerModel(controller.grip);
                    resolve(model);
                });
                controller.grip.add(controllerModel);
                // Rechten Controller für Raycasting merken
                if (inputSource.handedness === 'right') {
                    controller.tempMatrix = new Matrix4(); // Wiederverwendbares Matrix-Objekt für Raycasting
                    this.rightXRController = controller;
                }
                this.sendEvent(Controls.EventType.ControllerConnected, { controller: controller });
            });
        }
        // Start-Button erstellen und einblenden
        var xrStartButton = document.createElement('vrbutton');
        xrStartButton.innerHTML = 'Enter VR';
        xrStartButton.addEventListener('click', async () => {
            var xrSession = await navigator.xr.requestSession('immersive-vr', { optionalFeatures: [ 'local-floor', 'bounded-floor', 'hand-tracking' ] });
            // Beim Beenden Start-Button wieder anzeigen
            xrSession.addEventListener('end', () => { xrStartButton.style.display = 'flex'; });
            this.renderer.xr.setSession(xrSession);
            // Start-Button ausblenden, wenn XR-Modus gestartet ist
            xrStartButton.style.display = 'none';
            // Ready melden, Controller kommen asynchron nach, können aber schon benutzt werden
            this.sendEvent(Controls.EventType.Ready, { platform: this.platform });
        });
        document.body.appendChild(xrStartButton);
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
        // XR Rechter Controller zum Zeigen für Raycaster updaten
        if (this.rightXRController) {
            this.rightXRController.tempMatrix.identity().extractRotation(this.rightXRController.matrixWorld);
            this.raycaster.ray.origin.setFromMatrixPosition(this.rightXRController.matrixWorld);
            this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.rightXRController.tempMatrix);
            this.checkIntersection();
        }
        for (let inputSource of Object.values(this.inputSources)) {
            this.processInputSource(inputSource);
        }
    }

    /**
     * Prüft in der XR die Controller-Buttons und Achsen über die Gamepad
     * API und verschickt bei Änderung Events.
     * Muss im AnimationFrame gemacht werden.
     * 
     * Buttons:
     * 0 = Trigger
     * 1 = Grip
     * 2 = -
     * 3 = Thumbstick
     * 4 = A (rechts), X (links)
     * 5 = B (links), Y (rechts)
     * 
     * Achsen:
     * 0 = -
     * 1 = -
     * 2 = X (-1.0 ... +1.0)
     * 3 = Y (-1.0 ... +1.0)
     */
    processInputSource(inputSource) {
        for (let i = 0; i < inputSource.gamepad.buttons.length; i++) {
            let button = inputSource.gamepad.buttons[i];
            if (button.pressed && !button.pressedBefore) {
                button.pressedBefore = true;
                this.sendEvent(Controls.EventType.ButtonDown, { buttonType: Controls.ButtonType.XRController, button: i, controller: inputSource.controller });
            } else if (!button.pressed && button.pressedBefore) {
                button.pressedBefore = false;
                this.sendEvent(Controls.EventType.ButtonUp, { buttonType: Controls.ButtonType.XRController, button: i, controller: inputSource.controller });
            }
        }
        let xAxis = inputSource.gamepad.axes[2];
        let yAxis = inputSource.gamepad.axes[3];
        if (xAxis !== inputSource.gamepad.xAxisValue || yAxis !== inputSource.gamepad.yAxisValue) {
            inputSource.gamepad.xAxisValue = xAxis;
            inputSource.gamepad.yAxisValue = yAxis;
            this.sendEvent(Controls.EventType.AxisChange, { x: xAxis, y: yAxis, controller: inputSource.controller });
        }
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
    Keyboard: 'Controls.ButtonType.Keyboard',
    /**
     * Im "button" Attribut ist die Maustaste drin (0 = links, 1 = Mitte, 2 = Rechts)
     */
    Mouse: 'Controls.ButtonType.Mouse',
    Touch: 'Controls.ButtonType.Touch',
    XRController: 'Controls.ButtonType.XRController',
}

Controls.Button = {
    Mouse: {
        Left: 0,
        Right: 1,
        Middle: 2,
    },
    XR: {
        Left: {
            Trigger: 0,
            Grip: 1,
            Thumbstick: 3,
            X: 4,
            Y: 5,
        },
        Right: {
            Trigger: 0,
            Grip: 1,
            Thumbstick: 3,
            A: 4,
            B: 5,
        },
    },
};

Controls.EventType = {
    /**
     * Thumbsticks auf XR Controllern werden bewegt. Wird aber nur bei Änderung verschickt.
     * @param x Wert für X-Achse zwischen -1,0 und +1,0
     * @param y Wert für Y-Achse zwischen -1,0 und +1,0
     * @param controller Instanz des Controllers
     */
    AxisChange: 'Controls.EventType.AxisChange',
    /**
     * @param buttonType Controls.ButtonType des gedrückten Buttons
     * @param button Button-Code, der gedrückt wurde
     */
    ButtonDown: 'Controls.EventType.ButtonDown',
    /**
     * @param buttonType Controls.ButtonType des losgelassenen Buttons
     * @param button Button-Code, der losgelassen wurde. Bei XR-Controllern ist das "select" oder "squeeze"
     * @param controller Bei XR Controllern ist das die Instanz des Controllers
     */
    ButtonUp: 'Controls.EventType.ButtonUp',
    /**
     * Wenn XR-Controller angeschlossen werden
     * @param controller XR Controller-Instanz mit grip und xrInputSource Attributen
     */
    ControllerConnected: 'Controls.EventType.ControllerConnected',
    /**
     * @param intersection Infos über die vormalige Zeiger-Intersection, siehe https://threejs.org/docs/#api/en/core/Raycaster.intersectObject
     */
    PointerLeave: 'Controls.EventType.PointerLeave',
    /**
     * @param intersection Infos über die Zeiger-Intersection, siehe https://threejs.org/docs/#api/en/core/Raycaster.intersectObject
     */
    PointerUpdate: 'Controls.EventType.PointerUpdate',
    Ready: 'Controls.EventType.Ready',
};

Controls.Platform = {
    Desktop: 'Controls.Platform.Desktop',
    Touch: 'Controls.Platform.Touch',
    XR1: 'Controls.Platform.XR1',
    XR2: 'Controls.Platform.XR2',
    Hand: 'Controls.Platform.Hand',
}

export { Controls }