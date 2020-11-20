import { EventMesh } from './geometries.js';
import { CheckBoxGuiToggleButton, GuiButton, GuiTextOutput, GuiToggleButton, GuiToggleButtonList } from './gui.js';

/**
 * Das ist kein abstrakter Dialog, sondern speziell für die Manipulation von 3D Objekten.
 * 
 * Events:
 * - 
 */
class ObjectManipulationDialog extends EventMesh {

    constructor() {
        super();

        let screenToggleButtonList = new GuiToggleButtonList([
            this.createToggleButton('Hierarchie', 0, 1, 1, () => { this.showScreen('Home'); }),
            this.createToggleButton('Eigenschaften', 0, 2, 1, () => { 
                propertiesSubScreenToggleButtonList.children[0].handleButtonDown(); // Ersten Unterscreen immer markieren
                this.showScreen('Properties');
            }),
        ]);
        let propertiesSubScreenToggleButtonList = new GuiToggleButtonList([
            this.createToggleButton('Allgemein', 5, 1, 1, () => { this.showScreen('Properties'); }),
            this.createToggleButton('Bewegen', 5, 2, 1, () => { this.showScreen('Move'); }),
            this.createToggleButton('Rotieren', 5, 3, 1, () => { this.showScreen('Rotate'); }),
            this.createToggleButton('Skalieren', 5, 4, 1, () => { this.showScreen('Scale'); }),
        ]);
        let coordinatesToggleButtonList = new GuiToggleButtonList([
            this.createToggleButton('X', 1, 1, 1, () => { }),
            this.createToggleButton('Y', 1, 2, 1, () => { }),
            this.createToggleButton('Z', 1, 3, 1, () => { }),
        ]);
        let manipulateButtons = new EventMesh();
        manipulateButtons.add(...[
            this.createButton('+10', 1, 4, 1, () => {}),
            this.createButton('+1', 2, 4, 1, () => {}),
            this.createButton('+0,1', 3, 4, 1, () => {}),
            this.createButton('+0,01', 4, 4, 1, () => {}),
            this.createButton('-10', 1, 5, 1, () => {}),
            this.createButton('-1', 2, 5, 1, () => {}),
            this.createButton('-0,1', 3, 5, 1, () => {}),
            this.createButton('-0,01', 4, 5, 1, () => {}),
        ]);

        this._screens = {
            Home: [
                this.createButton('Ebene\nhoch', 0, 0, 1, () => {}),
                this.createTextOutput('Das ist kein abstrakter Dialog, sondern speziell für die Manipulation von 3D Objekten. Das ist kein abstrakter Dialog, sondern speziell für die Manipulation von 3D Objekten.', 1, 0, 4, 1, true, '/images/paper-bg-1.png'),
                this.createButton('Neues\nObjekt', 5, 0, 1, () => {}),

                screenToggleButtonList,
                this.createButton('', 1, 1, 2, () => {}),
                this.createButton('', 3, 1, 2, () => {}),
                this.createButton('Vorherige\nSeite', 5, 1, 1, () => {}),

                this.createButton('', 1, 2, 2, () => {}),
                this.createButton('', 3, 2, 2, () => {}),
                this.createTextOutput('Seite\n999 / 999', 5, 2, 1, 3, true, null, '#fff', .07),

                this.createTextOutput('', 0, 3, 1),
                this.createButton('', 1, 3, 2, () => {}),
                this.createButton('', 3, 3, 2, () => {}),

                this.createButton('Duplizieren', 0, 4, 1, () => {}),
                this.createButton('', 1, 4, 2, () => {}),
                this.createButton('', 3, 4, 2, () => {}),
        
                this.createButton('Löschen', 0, 5, 1, () => {}),
                this.createButton('', 1, 5, 2, () => {}),
                this.createButton('', 3, 5, 2, () => {}),
                this.createButton('Nächste\nSeite', 5, 5, 1, () => {}),
            ],
            Properties: [
                screenToggleButtonList,
                propertiesSubScreenToggleButtonList,

                this.createCheckBoxToggleButton(1, 2, 1, () => {}),
                this.createTextOutput('Hat eine Geometrie', 2, 2, 1, 1, true, null, '#600', .07),
            ],
            Move: [
                screenToggleButtonList,
                propertiesSubScreenToggleButtonList,
                coordinatesToggleButtonList,
                manipulateButtons,
            ],
            Rotate: [
                screenToggleButtonList,
                propertiesSubScreenToggleButtonList,
                coordinatesToggleButtonList,
                manipulateButtons,
            ],
            Scale: [
                screenToggleButtonList,
                propertiesSubScreenToggleButtonList,
                coordinatesToggleButtonList,
                manipulateButtons,
            ],
        };

        // Vorauswahl

        propertiesSubScreenToggleButtonList.children[0].handleButtonDown();
        screenToggleButtonList.children[0].handleButtonDown();
        coordinatesToggleButtonList.children[0].handleButtonDown();
    }

    _createButton(type, label, x, y, width, clickListener) {
        const button = new type({
            borderWidth: .02,
            text: label,
            objectWidth: width,
            textureWidth: width * 512,
            borderAmbientColor: '#333',
            borderEmissiveColor: '#000',
            buttonAmbientColor: '#600',
            buttonEmissiveColor: '#000',
            buttonHeight: .2,
            buttonInset: -.05,
            buttonInsetPressed: -.15,
            borderDepth: .15,
            buttonTilt: .04,
        });
        button.position.set(x, -y, 0);
        button._button.bumpScale = .001;
        button._button.textColor = '#fd0';
        button.addEventListener(GuiButton.EventType.Pressed, clickListener);
        return button;
    }

    createButton(label = '', x = 0, y = 0, width = 1, clickListener) {
        return this._createButton(GuiButton, label, x, y, width, clickListener);
    }

    createCheckBoxToggleButton(x = 0, y = 0, width = 1, clickListener) {
        return this._createButton(CheckBoxGuiToggleButton, null, x, y, width, clickListener);
    }

    createToggleButton(label = '', x = 0, y = 0, width = 1, clickListener) {
        return this._createButton(GuiToggleButton, label, x, y, width, clickListener);
    }

    createTextOutput(text = '', x = 0, y = 0, width = 1, height = 1, center = false, imageUrl = null, textColor = '#000', fontSize = .15) {
        let textOutput = new GuiTextOutput({
            ambientColor: '#333',
            emissiveColor: '#000',
            textColor: textColor,
            text: text,
            fontSize: fontSize,
            padding: .05,
            objectWidth: width,
            objectHeight: height,
            center: center,
            imageUrl: imageUrl,
        });
        textOutput.position.set(x, -y, 0);
        textOutput.bumpScale = -.0005;
        return textOutput;
    }

    showScreen(screenName) {
        this.children.forEach(child => child.enableForRayCaster = false);
        this.remove(...this.children);
        Object.values(this._screens[screenName]).forEach(child => {
            child.enableForRayCaster = true;
            this.add(child);
        });
    }

    set borderAmbientColor(value) { this._buttons.forEach(b => b.borderAmbientColor = value); }
    set borderEmissiveColor(value) { this._buttons.forEach(b => b.borderEmissiveColor = value); }
    set borderDepth(value) { this._buttons.forEach(b => b.borderDepth = value); }
    set borderWidth(value) { this._buttons.forEach(b => b.borderWidth = value); }
    set buttonAmbientColor(value) { this._buttons.forEach(b => b.buttonAmbientColor = value); }
    set buttonEmissiveColor(value) { this._buttons.forEach(b => b.buttonEmissiveColor = value); }
    set buttonHeight(value) { this._buttons.forEach(b => b.buttonHeight = value); }
    set buttonInset(value) { this._buttons.forEach(b => b.buttonInset = value); }
    set buttonInsetPressed(value) { this._buttons.forEach(b => b.buttonInsetPressed = value); }
    set buttonTextColor(value) { this._buttons.forEach(b => b._button.textColor = value); }
    set buttonTilt(value) { this._buttons.forEach(b => b.buttonTilt = value); }
   
}

ObjectManipulationDialog.EventType = {
    /**
     * Wird gesendet, wenn eine Taste gedrückt wurde.
     * Hat als Paramter den Wert der Taste
     */
    //KeyPressed: 'keyboardkeypressed',
};

export { ObjectManipulationDialog }