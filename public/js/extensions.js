// Funktionserweiterungen für Meshes.

import { Controls } from "./controls.js";

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
 * cube.addEventListener(EventExtension.EventType.ButtonDown, (targetObject, buttonType, button) => { ... });
 * // Button wird losgelassen während Zeiger auf Objekt zeigt
 * cube.addEventListener(EventExtension.EventType.ButtonUp, (targetObject, buttonType, button) => { ... });
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
        this.controlsInstance.addEventListener(Controls.EventType.PointerLeave, (_, intersection) => this.handlePointerLeave(intersection));
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

    handleButtonDown(buttonType, button) {
        console.log(this, buttonType, button);
    }

    handleButtonUp(buttonType, button) {
        console.log(this, buttonType, button);
    }

    handlePointerLeave(intersection) {
        if (this.currentIntersectedObject) {
            this.currentIntersectedObject.sendEvent(EventExtension.EventType.PointerLeave, 'furz', 'Ähustebn');
        }
        this.currentIntersectedObject = null;
    }

    handlePointerUpdate(intersection) {
        //console.log(this, intersection);
        this.currentIntersectedObject = intersection.object;
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
     * @param buttonType Controls.ButtonType des gedrückten Buttons
     * @param button Button-Code, der gedrückt wurde
     */
    ButtonDown: 'EventExtension.EventType.ButtonDown',
    /**
     * Button wird losgelassen während Zeiger auf Objekt zeigt
     * @param targetObject Objekt, auf den der Zeiger zeigt
     * @param buttonType Controls.ButtonType des losgelassenen Buttons
     * @param button Button-Code, der losgelassen wurde
     */
    ButtonUp: 'EventExtension.EventType.ButtonUp',
}

export { EventExtension }