import { BufferAttribute, BufferGeometry, CanvasTexture, CylinderBufferGeometry, Mesh, MeshPhongMaterial, Object3D, PlaneGeometry, TextureLoader } from '../js/lib/three.module.js';
import { EventMesh } from './geometries.js';

// constructor-Parameter: https://stackoverflow.com/a/52509813/12127220

/**
 * Das ist der Rahmen eines GuiButtons.
 */
class Border extends Mesh {

    /**
     * config = {
     *  ambientColor = 0xffeb3b,
     *  borderDepth = 1,
     *  borderWidth = .1,
     *  emissiveColor = 0x484210,
     *  objectHeight = 1,
     *  objectWidth = 1,
     * }
     */
    constructor(config) {
        super(new BufferGeometry(), new MeshPhongMaterial());
        this._ambientColor = 0xffeb3b;
        this._borderDepth = 1;
        this._borderWidth = .1;
        this._emissiveColor = 0x484210;
        this._objectHeight = 1;
        this._objectWidth = 1;
        Object.assign(this, config);
        this.updateVertices();
        this.updateMaterial();
    }

    updateMaterial() {
        this.material.setValues({ color: this._ambientColor, emissive: this._emissiveColor });
    }

    updateVertices() {
        const bw = this._borderWidth, bd = this._borderDepth, ow = this._objectWidth, oh = this._objectHeight;
        const vertices = new Float32Array([
            0.0,  0.0, 0.0,        // 0
            bw, -bw, 0.0,          // 2
            ow,  0.0, 0.0,         // 1

            bw, -bw, 0.0,          // 2
            ow - bw, -bw, 0.0,     // 3
            ow,  0.0, 0.0,         // 1

            0.0,  0.0, 0.0,        // 0
            0.0, -oh, 0.0,         // 6
            bw, -bw, 0.0,          // 2

            0.0, -oh, 0.0,         // 6
            bw, bw - oh, 0.0,      // 4
            bw, -bw, 0.0,          // 2

            0.0, -oh, 0.0,         // 6
            ow - bw, bw - oh, 0.0, // 5
            bw, bw - oh, 0.0,      // 4

            0.0, -oh, 0.0,         // 6
            ow, -oh, 0.0,          // 7
            ow - bw, bw - oh, 0.0, // 5

            ow - bw, bw - oh, 0.0, // 5
            ow,  0.0, 0.0,         // 1
            ow - bw, -bw, 0.0,     // 3

            ow - bw, bw - oh, 0.0, // 5
            ow, -oh, 0.0,          // 7
            ow,  0.0, 0.0,         // 1


            bw, -bw, 0.0,          // 2
            bw, -bw, -bd,          // 8
            ow - bw, -bw, 0.0,     // 3

            bw, -bw, -bd,          // 8
            ow - bw, -bw, -bd,     // 9
            ow - bw, -bw, 0.0,     // 3

            bw, bw - oh, 0.0,      // 4
            bw, bw - oh, -bd,      // 10
            bw, -bw, 0.0,          // 2

            bw, bw - oh, -bd,      // 10
            bw, -bw, -bd,          // 8
            bw, -bw, 0.0,          // 2

            ow - bw, bw - oh, 0.0, // 5
            ow - bw, bw - oh, -bd, // 11
            bw, bw - oh, 0.0,      // 4

            ow - bw, bw - oh, -bd, // 11
            bw, bw - oh, -bd,      // 10
            bw, bw - oh, 0.0,      // 4

            ow - bw, -bw, 0.0,     // 3
            ow - bw, -bw, -bd,     // 9
            ow - bw, bw - oh, 0.0, // 5

            ow - bw, -bw, -bd,     // 9
            ow - bw, bw - oh, -bd, // 11
            ow - bw, bw - oh, 0.0, // 5

        ]);
        this.geometry.setAttribute('position', new BufferAttribute(vertices, 3));
        this.geometry.computeVertexNormals(); // Damit das Phong Material funktioniert, siehe https://stackoverflow.com/questions/47059946/buffergeometry-showing-up-as-black-with-phongmaterial
    }

    set ambientColor(value) {
        this._ambientColor = value;
        this.updateMaterial();
    }

    set borderDepth(value) {
        this._borderDepth = value;
        this.updateVertices();
    }

    set borderWidth(value) {
        this._borderWidth = value;
        this.updateVertices();
    }

    set emissiveColor(value) {
        this._emissiveColor = value;
        this.updateMaterial();
    }

    set objectHeight(value) {
        this._objectHeight = value;
        this.updateVertices();
    }

    set objectWidth(value) {
        this._objectWidth = value;
        this.updateVertices();
    }
}

/**
 * Der eigentliche Knopf in einem Gui-Button, der sich bewegt.
 */
class Button extends EventMesh {

    /**
     * config = {
     *  ambientColor = 0xeb3bff,
     *  borderDepth = 1,
     *  borderWidth = .1,
     *  emissiveColor = 0x421048,
     *  imageUrl = null,
     *  objectHeight = 1,
     *  objectWidth = 1,
     *  text = null,
     *  textureHeight = 512,
     *  textureWidth = 512,
     *  tilt = 0,
     * }
     */
    constructor(config) {
        super(new BufferGeometry(), new MeshPhongMaterial());
        this._ambientColor = 0xeb3bff;
        this._emissiveColor = 0x421048;
        this._imageUrl = null;
        this._objectDepth = 1;
        this._objectHeight = 1;
        this._objectWidth = 1;
        this._text = null;
        this._textureHeight = 512;
        this._textureWidth = 512;
        this._tilt = 0;
        this._ctx = document.createElement('canvas').getContext('2d');
        const texture = new CanvasTexture(this._ctx.canvas);;
        this.material.map = texture;
        this.material.bumpMap = texture;
        this.material.bumpScale = .005;
        const uvcoords = new Float32Array([
            0.0, 1.0,
            1.0, 1.0,
            0.125, 0.875,
            0.875, 0.875,
            0.125, 0.125,
            0.875, 0.125,
            0.0, 0.0,
            1.0, 0.0,
        ]);
        const indices = [
            0, 2, 1,
            3, 1, 2,
            2, 3, 1,
            0, 6, 2,
            6, 4, 2,
            6, 5, 4,
            6, 7, 5,
            5, 1, 3,
            5, 7, 1,

            2, 4, 3,
            4, 5, 3,
        ];
        this.geometry.setAttribute( 'uv', new BufferAttribute( uvcoords, 2 ) );
        this.geometry.setIndex(indices);
        Object.assign(this, config);
        this.updateVertices();
        this.updateMaterial();
        this.repaint();
    }

    set ambientColor(value) {
        this._ambientColor = value;
        this.updateMaterial();
    }

    set bumpScale(value) {
        this.material.bumpScale = value;
        this.repaint();
    }

    set emissiveColor(value) {
        this._emissiveColor = value;
        this.updateMaterial();
    }

    set imageUrl(value) {
        if (!value) {
            this._image = null;
            this.repaint(); //  Clear image
        } else {
            this._image = new Image(this._textureWidth, this._textureHeight);
            this._image.onload = () => {
                this.repaint();
            }
            this._image.src = value;
        }
    }

    set objectDepth(value) {
        this._objectDepth = value;
        this.updateVertices();
    }

    set objectHeight(value) {
        this._objectHeight = value;
        this.updateVertices();
    }

    set objectWidth(value) {
        this._objectWidth = value;
        this.updateVertices();
    }

    set text(value) {
        this._text = value;
        this.repaint();
    }

    set tilt(value) {
        this._tilt = value;
        this.updateVertices();
    }

    updateMaterial() {
        this.material.setValues({ color: this._ambientColor, emissive: this._emissiveColor });
    }

    updateVertices() {
        const ow = this._objectWidth, od = this._objectDepth, oh = this._objectHeight, t = this._tilt;
        const vertices = new Float32Array([
            0.0,  0.0, 0.0,
            ow,  0.0, 0.0,
            t, -t, od,
            ow - t, -t, od,
            t, t - oh, od,
            ow - t, t - oh, od,
            0.0, -oh, 0.0,
            ow, -oh, 0.0,
        ]);
        this.geometry.setAttribute( 'position', new BufferAttribute( vertices, 3 ) );
        this.geometry.computeVertexNormals(); // Damit das Phong Material funktioniert, siehe https://stackoverflow.com/questions/47059946/buffergeometry-showing-up-as-black-with-phongmaterial
    }

    repaint() {
        this._ctx.canvas.width = this._textureWidth;
        this._ctx.canvas.height = this._textureHeight;
        this._ctx.fillStyle = '#FFF';
        this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
        if (this._image) {
            this._ctx.drawImage(this._image, 0, 0, this._image.width, this._image.height);
        }
        if (this._text) {
            this._ctx.fillStyle = '#000';
            this._ctx.font = '100px sans-serif';
            const lines = this._text.split('\n');
            const lineWidth = 0.6 * this._textureWidth; // Bisschen Platz rundrum lassen
            var maxWidth = 0;
            for (var line of lines) {
                const measure = this._ctx.measureText(line);
                if (measure.width > maxWidth) maxWidth = measure.width;
            }
            const scaledFontSize = lineWidth / maxWidth * 100;
            this._ctx.font = scaledFontSize + 'px sans-serif';
            this._ctx.textAlign = 'center';
            this._ctx.textBaseline = 'middle';
            const numberOfLines = lines.length;
            const yOffset = this._textureHeight / 2 - (numberOfLines * scaledFontSize / 2) + (scaledFontSize / 2);
            for (var i = 0; i < numberOfLines; i++) {
                const line = lines[i];
                var y = yOffset + (i * scaledFontSize);
                this._ctx.fillText(line, this._textureWidth / 2, y);
            }
        }
        this.material.map.needsUpdate = true;
    }
}

/**
 * Button mit Rahmen, den man drücken kann.
 * Der kommt wieder raus, wenn man loslässt.
 */
class GuiButton extends EventMesh {

    /**
     * config = {
     *  borderAmbientColor = 0xffeb3b,
     *  borderEmissiveColor = 0x421048,
     *  borderDepth = 1,
     *  borderWidth = .1,
     *  buttonAmbientColor = 0xeb3bff,
     *  buttonEmissiveColor = 0x421048,
     *  buttonHeight = .4,
     *  buttonInset = -.1,
     *  buttonInsetPressed = -.3,
     *  buttonTilt = .1,
     *  imageUrl = null,
     *  objectHeight = 1,
     *  objectWidth = 1,
     *  text = null,
     * }
     */
    constructor(config) {
        super();
        this._border = new Border();
        this.add(this._border);
        this._button = new Button();
        this._button.addEventListener(EventMesh.EventType.ButtonDown, () => {
            this.handleButtonDown();
        });
        this._button.addEventListener(EventMesh.EventType.ButtonUp, () => {
            this.handleButtonUp();
        });
        this._button.enableForRayCaster = true;
        this.add(this._button);

        this.borderDepth = 0.3;
        this.borderWidth = 0.1;
        this.buttonHeight = 0.4;
        this.buttonInset = -0.1;
        this.buttonInsetPressed = -0.3;
        this.buttonTilt = 0.1;
        this.objectHeight = 1;
        this.objectWidth = 1;
        this.imageUrl = null;
        this.text = null;
        Object.assign(this, config);
    }

    set borderAmbientColor(value) {
        this._border.ambientColor = value;
    }

    set borderEmissiveColor(value) {
        this._border.emissiveColor = value;
    }

    set borderDepth(value) {
        this._border.borderDepth = value;
    }

    set borderWidth(value) {
        this._borderWidth = value;
        this._border.borderWidth = value;
        this.scaleButton();
    }

    set buttonAmbientColor(value) {
        this._button.ambientColor = value;
    }

    set buttonEmissiveColor(value) {
        this._button.emissiveColor = value;
    }

    set buttonHeight(value) {
        this._button.objectDepth = value;
    }

    set buttonInset(value) {
        this._buttonInset = value;
        if (!this._isCurrentlyPressed) {
            this._button.position.z = this._buttonInset;
        }
    }

    set buttonInsetPressed(value) {
        this._buttonInsetPressed = value;
        if (this._isCurrentlyPressed) {
            this._button.position.z = this._buttonInsetPressed;
        }
    }

    set buttonTilt(value) {
        this._button.tilt = value;
    }

    set imageUrl(value) {
        this._button.imageUrl = value;
    }

    set objectHeight(value) {
        this._objectHeight = value;
        this._border.objectHeight = value;
        //this._button.objectHeight = value;
        this.scaleButton();
    }

    set objectWidth(value) {
        this._objectWidth = value;
        this._border.objectWidth = value;
        //this._button.objectWidth = value;
        this.scaleButton();
    }

    set text(value) {
        this._button.text = value;
    }

    handleButtonDown() {
        this.setPressed(true);
    }

    handleButtonUp() {
        this.setPressed(false);
    }

    setPressed(pressed) {
        console.log(pressed, this._isCurrentlyPressed, this._button.position.z, this._buttonInset, this._buttonInsetPressed)
        this._isCurrentlyPressed = this._button.position.z === this._buttonInsetPressed;
        if (this._isCurrentlyPressed && !pressed) {
            this._button.position.z = this._buttonInset;
            this.sendEvent(GuiButton.EventType.Released);
        } else if (!this._isCurrentlyPressed && pressed) {
            this._button.position.z = this._buttonInsetPressed;
            this.sendEvent(GuiButton.EventType.Pressed);
        }
    }

    scaleButton() {
        console.log(this._objectWidth);
        this._button.scale.set(this._objectWidth - ( 2 * this._borderWidth), this._objectHeight - ( 2 * this._borderWidth), 1);
        this._button.position.x = this._borderWidth;
        this._button.position.y = -this._borderWidth;
    }

}

GuiButton.EventType = {
    /**
     * Wird gesendet, wenn ein Button reingedrückt wurde, aber nicht, wenn er vorher schon gedrückt war
     */
    Pressed: 'guibuttonpressed',
    /**
     * Wird gesendet, wenn ein Button rausgedrückt oder losgelassen wurde
     */
    Released: 'guibuttonreleased',
};

/**
 * Umschalter-Button. Wenn man den drückt, bleibt er drin.
 * Drückt man nochmal, kommt er wieder raus.
 */
class GuiToggleButton extends GuiButton {

    constructor(config) {
        super(config);
        this._shouldHandleUp = false;
    }

    handleButtonDown() {
        if (this._button.position.z === this._buttonInset) {
            this.setPressed(true);
            this._shouldHandleUp = false;
        } else {
            this._shouldHandleUp = true;
        }
    }

    handleButtonUp() {
        if (!this._shouldHandleUp) return;
        if (this._button.position.z === this._buttonInsetPressed) {
            this.setPressed(false);
            this._shouldHandleUp = false;
        }
    }
}

/**
 * Liste von Toggle-Buttons, die sich gegensetig bedingen.
 * Drückt man einen, kommen die anderen raus.
 */
class GuiToggleButtonList extends Object3D {

    constructor() {
        super();
        this.buttonList = [];
    }

    addToggleButton(button) {
        var buttonList = this.buttonList;
        button.handleButtonDown = function() { // Drücken "entdrückt" alle anderen Buttons
            for (var b of buttonList) {
                b.setPressed(b === this);
            }
        }
        button.handleButtonUp = () => {}; // Button kann nicht direkt deaktiviert werden
        this.buttonList.push(button);
        this.add(button);
    }

}

export { GuiButton, GuiToggleButton, GuiToggleButtonList }
