import {Mesh, MeshBasicMaterial, PlaneGeometry, Texture, TextureLoader, Vector3} from './lib/three.module.js';

import camera from './camera.js';

/**
 * Grundlage aller Meshes, die irgendwie manipuliert oder mit denen interagiert werden kann.
 * Wird von RayCastern genutzt, um diverse Events zu erzeugen, auf die Listener dann hören können.
 * https://gitlab.com/hilderonny/vrcollab/-/issues/6
 */
class EventMesh extends Mesh {

    /**
     * Liste aller Event Meshes, die für RayCaster verfügbar sind.
     */
    static AllRaycasterMeshes = [];

     /**
      * Enum aller Event Typen
      */
    static EventType = {
        /**
         * Controller-Zeiger zeigt auf Objekt. Dient zum visuellen Hervorheben des Objektes.
         * Callback-Parameter:
         * - target : Objekt, das das Event betrifft
         */
        PointerEnter: 'pointerenter',
        /**
         * Controller-Zeiger verlässt ein Objekt.
         * Callback-Parameter:
         * - target : Objekt, das das Event betrifft
         */
        PointerLeave: 'pointerleave',
        /**
         * Ein Controller-Knopf wird gedrückt, während der Controller auf ein Objekt zeigt.
         * Callback-Parameter:
         * - target : Objekt, das das Event betrifft
         * - button : Code des Buttons, der gedrückt wurde
         * - point : 3D-Punkt, an dem der Zeiger beim Button-Druck auf das Objekt trifft
         */
        ButtonDown: 'buttondown',
        /**
         * Ein Controller-Knopf wird losgelassen, während der Controller auf ein Objekt zeigt.
         * Callback-Parameter:
         * - target : Objekt, das das Event betrifft
         * - button : Code des Buttons, der losgelassen wurde
         * - point : 3D-Punkt, an dem der Zeiger beim Button-Loslassen auf das Objekt trifft
         */
        ButtonUp: 'buttonup'
    }

    /**
     * Enum aller Button Codes.
     * Siehe https://gitlab.com/hilderonny/vrcollab/-/issues/6
     */
    static ButtonCode = {
        /** Linke Maustaste */
        MouseLeft: 300,
        /** Touchscreen */
        TouchScreen: 400,
    }

    #eventListeners = {};

     /**
      * Erstellt eine EventMesh
      * @param geometry Optional. Ohne Angabe wird das eine BufferGeometry.
      * @param material Optional. Ohne Angabe wird das eine MeshBasicMaterial.
      */
    constructor(geometry, material) {
        super(geometry, material);
    }

    /**
     * Registriert einen Event Listener.
     * Bei mehrfacher Registrierung wird der Listener mehrfach aufgerufen.
     * @param eventType Event, auf das gelauscht werden soll.
     * @param listener Listener, der bei Eintreten des Events aufgerufen wird.
     */
    addEventListener(eventType, listener) {
        var listeners = this.#eventListeners[eventType];
        if (!listeners) {
            listeners = [];
            this.#eventListeners[eventType] = listeners;
        }
        listeners.push(listener);
    }

    /**
     * Aktiviert das Objekt für Raycaster oder deaktiviert es.
     */
    set enableForRayCaster(enable) {
        var pos = EventMesh.AllRaycasterMeshes.indexOf(this);
        if (enable) {
            if (pos < 0) EventMesh.AllRaycasterMeshes.push(this);
        } else {
            if (pos >= 0) EventMesh.AllRaycasterMeshes.splice(pos, 1);
        }
    }

    /**
     * Entfernt einen Event Listener.
     * Bei mehrfacher Registrierung wird nur die erste Registrierung gelöscht.
     * @param eventType Event, auf das gelauscht wurde.
     * @param listener Listener, der bei Eintreten des Events aufgerufen wurde.
     */
    removeEventListener(eventType, listener) {
        var listeners = this.#eventListeners[eventType];
        if (!listeners) return;
        var pos = listeners.indexOf(listener);
        if (pos < 0) return;
        listeners.splice(pos, 1);
    }

    /**
     * Sendet ein bestimmtes Event an alle Listeners.
     * target wird dabei automatisch bestimmt, buttonCode muss vom Aufrufer ggf. gesetzt werden.
     * @param eventType Event, das gesendet werden soll
     * @param buttonCode Optional. Code des Buttons (EventMesh.ButtonCode), wenn denn einer gedrückt wurde
     * @param point Optional. Punkt, an dem der Zeiger auf das Objekt trifft
     */
    sendEvent(eventType, buttonCode, point) {
        var listeners = this.#eventListeners[eventType];
        if (!listeners) return;
        for (var listener of listeners) {
            listener(buttonCode, point);
        }
    }
}

class LogPanel extends Mesh {

    constructor(width, height, rowCount, lineCount, backgroundColor, textColor) {
        super(
            new PlaneGeometry(width, height, 1, 1)
        );
        this.fontsize = 18;
        this.lines = [];
        var canvas = document.createElement('canvas');
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.rowCount = rowCount;
        this.lineCount = lineCount;
        this.canvasWidth =this.fontsize * this.rowCount / 1.8;
        this.canvasHeight = this.fontsize * this.lineCount;
        canvas.setAttribute('width', this.canvasWidth);
        canvas.setAttribute('height', this.canvasHeight);
        this.textcontext = canvas.getContext('2d');
	    this.textcontext.font = this.fontsize + 'px monospace';
        this.texture = new Texture(canvas) ;
        this.material = new MeshBasicMaterial({ map: this.texture, flatShading: true });
        LogPanel.lastPanel = this;
    }

    update() {
        this.textcontext.fillStyle = this.backgroundColor;
        this.textcontext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);        
        this.textcontext.fillStyle = this.textColor;
        for (var i = 0; i < this.lines.length; i++) {
            this.textcontext.fillText(this.lines[i], 0, this.fontsize * (i + .8) );
        }
    }

    log(val) {
        var text = '' + val;
        this.lines.push(...text.split('\n'));
        while(this.lines.length > this.lineCount) this.lines.shift();
        this.update();
        this.texture.needsUpdate = true;
    }

}

class MenuPanel extends Mesh {

    constructor(width, height) {
        super(
            new PlaneGeometry(width, height, 1, 1)
        );
        var loader = new TextureLoader();
        this.material = new MeshBasicMaterial({
            map: loader.load('lcars-demo-small.png'),
            flatShading: true,
        });        
    }

    update() {
    }

}

class TeleportMesh extends EventMesh {

    constructor(geometry, material) {
        super(geometry, material);
        super.addEventListener(EventMesh.EventType.ButtonUp, (button, point) => {
            if ([
                EventMesh.ButtonCode.MouseLeft,
                EventMesh.ButtonCode.TouchScreen,
            ].includes(button)) {
                camera.head.position.copy(point); // Teleport
            }
        });
        super.enableForRayCaster = true;
    }

}

export { EventMesh, LogPanel, MenuPanel, TeleportMesh }