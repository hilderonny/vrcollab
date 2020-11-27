// Funktionserweiterungen für Meshes.

import { Controls } from './controls.js';
import { Sphere } from './geometries.js';

/**
 * Bringt eine Mesh dazu, pointer-Events zu schicken und hat Event-Listener.
 * 
 * @example
 * let controls = new Controls();
 * let cube = new Cube();
 * let eventExtension = new EventExtension(controls);
 * eventExtension.apply(cube);
 * // Zeigerstrahl bewegt sich auf Objekt herum
 * cube.addEventListener(EventExtension.EventType.PointerMove, (targetObject, coords) => { ... });
 * // Zeigerstrahl verlässt Objekt
 * cube.addEventListener(EventExtension.EventType.PointerLeave, (targetObject) => { ... });
 * // Button wird gedrückt während Zeiger auf Objekt zeigt
 * cube.addEventListener(EventExtension.EventType.ButtonDown, (targetObject, { buttonType, button }) => { ... });
 * // Button wird losgelassen während Zeiger auf Objekt zeigt
 * cube.addEventListener(EventExtension.EventType.ButtonUp, (targetObject, { buttonType, button }) => { ... });
*/
class EventExtension {

    /**
     * @param {Controls} controlsInstance Instanz der Eingabekontrollen
     */
    constructor(controlsInstance) {
        this.controlsInstance = controlsInstance;
        // Listener für diverse Events registrieren
        this.controlsInstance.addEventListener(Controls.EventType.ButtonDown, (_, buttonType, button) => this.handleButtonDown(buttonType, button));
        this.controlsInstance.addEventListener(Controls.EventType.ButtonUp, (_, buttonType, button) => this.handleButtonUp(buttonType, button));
        this.controlsInstance.addEventListener(Controls.EventType.PointerLeave, () => this.handlePointerLeave());
        this.controlsInstance.addEventListener(Controls.EventType.PointerUpdate, (_, intersection) => this.handlePointerUpdate(intersection));
        // Gerade angezieltes Objekt, an dieses werden Button Events geschickt
        this.currentIntersectedObject = null;
    }

    /**
     * Eventlistener für EventExtension - Meshes
     * @param {EventExtension.EventType} eventType Art des Events. Diese bestimmt, welche Parameter die callback-Funktion haben muss.
     * @param {function} callback Callback-Funktion, die bei Eintreten des Events aufgerufen wird.
     */
    addEventListenerTemplate(eventType, callback) {
        if (!this.eventListeners[eventType]) this.eventListeners[eventType] = [];
        this.eventListeners[eventType].push(callback);
    }

    /**
     * Fügt einer Mesh die EventExtension hinzu.
     * Diese bekommt die addEventListener() - Funktion und wird der Raycaster-Liste der controlsInstance bekannt gemacht.
     * @param {*} meshInstance Mesh, welches die Erweiterung erhalten soll
     */
    apply(meshInstance) {
        meshInstance.addEventListener = this.addEventListenerTemplate; // Event Listener-Funktion zur Mesh hinzufügen
        meshInstance.sendEvent = this.sendEventTemplate;
        meshInstance.eventListeners = {};
        this.controlsInstance.raycastableObjects.push(meshInstance); // Mesh dem Raycaster der Controls-Instanz bekannt machen
    }

    handleButtonDown(eventDetails) {
        if (this.currentIntersectedObject) {
            this.currentIntersectedObject.sendEvent(EventExtension.EventType.ButtonDown, eventDetails);
        }
    }

    handleButtonUp(eventDetails) {
        if (this.currentIntersectedObject) {
            this.currentIntersectedObject.sendEvent(EventExtension.EventType.ButtonUp, eventDetails);
        }
    }

    handlePointerLeave() {
        if (this.currentIntersectedObject) {
            this.currentIntersectedObject.sendEvent(EventExtension.EventType.PointerLeave);
        }
        this.currentIntersectedObject = null;
    }

    handlePointerUpdate(intersection) {
        this.currentIntersectedObject = intersection.object;
        this.currentIntersectedObject.sendEvent(EventExtension.EventType.PointerMove, intersection.point);
    }

    /**
     * Verschickt Events an Listener
     */
    sendEventTemplate(eventType, ...params) {
        if (this.eventListeners[eventType]) {
            this.eventListeners[eventType].forEach(callback => callback(this, ...params));
        }
    }
    
}

/**
 * Eventarten, die von Objekten gesendet werden, die die EventExtension besitzen.
 */
EventExtension.EventType = {
    /**
     * Zeigerstrahl bewegt sich auf Objekt herum
     * @param targetObject Objekt, auf den der Zeiger zeigt
     * @param coords Vector3 Koordinaten des Punktes, an dem der Zeigerstrahl auf das Objekt trifft
     */
    PointerMove: 'EventExtension.EventType.PointerMove',
    /**
     * Zeigerstrahl verlässt Objekt
     * @param targetObject Objekt, das der Zeiger verlassen hat
     */
    PointerLeave: 'EventExtension.EventType.PointerLeave',
    /**
     * Button wird gedrückt während Zeiger auf Objekt zeigt
     * @param targetObject Objekt, auf den der Zeiger zeigt
     * @param eventDetails.buttonType Controls.ButtonType des gedrückten Buttons
     * @param eventDetails.button Button-Code, der gedrückt wurde
     */
    ButtonDown: 'EventExtension.EventType.ButtonDown',
    /**
     * Button wird losgelassen während Zeiger auf Objekt zeigt
     * @param targetObject Objekt, auf den der Zeiger zeigt
     * @param eventDetails.buttonType Controls.ButtonType des losgelassenen Buttons
     * @param eventDetails.button Button-Code, der losgelassen wurde
     */
    ButtonUp: 'EventExtension.EventType.ButtonUp',
}

/**
 * Beim Zeigen auf ein solch erweitertes Objekt wird eine Zielkugel angezeigt.
 * Beim Anklicken oder Tippen oder Triggern teleportiert der Benutzer dort hin.
 * Muss nach EventExtension hinzugefügt werden, weil es die addEventListener() Methode
 * des Zielobjektes verwendet.
 * 
 * @example
 * 
 * let controls = new Controls();
 * let camera = new Camera();
 * let cube = new Cube();
 * let eventExtension = new EventExtension(controls);
 * eventExtension.apply(cube);
 * let teleportExtension = new TeleportExtension(camera);
 * teleportExtension.apply(cube);
 */
class TeleportExtension {

    /**
     * @param {Camera} cameraInstance Instanz der Kamera, die beim Teleportieren bewegt wird
     */
    constructor(cameraInstance) {
        this.cameraInstance = cameraInstance;
        this.sphere = new Sphere();
        this.sphere.material.color.set('#f60');
        this.sphere.scale.set(.1, .1, .1);
        this.sphere.visible = false;
        this.cameraInstance.head.parent.add(this.sphere); // Das ist die Szene selbst. Dazu muss die Kamera vorher der Szene hinzugefügt worden sein
    }
    
    /**
     * Auf dem Mesh wird auf Zeigerbewegungen und Button Klicks reagiert
     */
    apply(meshInstance) {
        meshInstance.addEventListener(EventExtension.EventType.ButtonUp, (_, { buttonType, button, controller }) => this.handleButtonUp(buttonType, button, controller));
        meshInstance.addEventListener(EventExtension.EventType.PointerLeave, () => this.handlePointerLeave());
        meshInstance.addEventListener(EventExtension.EventType.PointerMove, (_, coords) => this.handlePointerMove(coords));
    }

    /**
     * Zeiger muss sich auf Mesh befinden. Triggert bei:
     * - linke Maustaste
     * - Touch allgemein
     */
    handleButtonUp(buttonType, button, controller) {
        if (
            (buttonType === Controls.ButtonType.Mouse && button === Controls.Button.Mouse.Left) ||
            (buttonType === Controls.ButtonType.Touch) ||
            (buttonType === Controls.ButtonType.XRController && controller.xrInputSource.handedness === 'right' && button === Controls.Button.XR.Right.Trigger)
        ) {
            this.cameraInstance.head.position.copy(this.sphere.position);
        }
    }

    handlePointerLeave() {
        // Die Teleportzielkugel soll nicht mehr sichtbar sein, wenn kein gültiges Ziel anvisiert wird
        this.sphere.visible = false;
    }

    handlePointerMove(coords) {
        // Teleportzielkugel unter Zeigerauftreffpunkt anzeigen
        this.sphere.visible = true;
        this.sphere.position.copy(coords);
    }

}

export { EventExtension, TeleportExtension }