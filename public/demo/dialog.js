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
        this._screens = {};

        let screenToggleButtonList = new GuiToggleButtonList();
        let propertiesSubScreenToggleButtonList = new GuiToggleButtonList();
        let coordinatesToggleButtonList = new GuiToggleButtonList();

        // Home

        let homeScreen = {};
        homeScreen['LevelUpButton'] = this.createButton('Ebene\nhoch', 0, 0, 1, () => {});
        homeScreen['CurrentLevelOutput'] = this.createTextOutput('Das ist kein abstrakter Dialog, sondern speziell für die Manipulation von 3D Objekten. Das ist kein abstrakter Dialog, sondern speziell für die Manipulation von 3D Objekten.', 1, 0, 4, 1, true, '/images/paper-bg-1.png');
        homeScreen['AddButton'] = this.createButton('Neues\nObjekt', 5, 0, 1, () => {});

        let homeToggleButton = this.createToggleButton('Hierarchie', 0, 1, 1, () => { this.showScreen('Home'); })
        screenToggleButtonList.addToggleButton(homeToggleButton);
        homeScreen['ListButton00'] = this.createButton('', 1, 1, 2, () => {});
        homeScreen['ListButton10'] = this.createButton('', 3, 1, 2, () => {});
        homeScreen['UpButton'] = this.createButton('Vorherige\nSeite', 5, 1, 1, () => {});

        screenToggleButtonList.addToggleButton(this.createToggleButton('Eigenschaften', 0, 2, 1, () => { 
            propertiesToggleButton.handleButtonDown(); // Ersten Unterscreen immer markieren
            this.showScreen('Properties');
        }));
        homeScreen['ListButton01'] = this.createButton('', 1, 2, 2, () => {});
        homeScreen['ListButton11'] = this.createButton('', 3, 2, 2, () => {});
        homeScreen['CurrentPageOutput'] = this.createTextOutput('Seite\n999 / 999', 5, 2, 1, 3, true, null, '#fff', .07);

        homeScreen['EmptyLabel1'] = this.createTextOutput('', 0, 3, 1);
        homeScreen['ListButton02'] = this.createButton('', 1, 3, 2, () => {});
        homeScreen['ListButton12'] = this.createButton('', 3, 3, 2, () => {});

        homeScreen['CopyButton'] = this.createButton('Duplizieren', 0, 4, 1, () => {});
        homeScreen['ListButton03'] = this.createButton('', 1, 4, 2, () => {});
        homeScreen['ListButton13'] = this.createButton('', 3, 4, 2, () => {});

        homeScreen['DeleteButton'] = this.createButton('Löschen', 0, 5, 1, () => {});
        homeScreen['ListButton04'] = this.createButton('', 1, 5, 2, () => {});
        homeScreen['ListButton14'] = this.createButton('', 3, 5, 2, () => {});
        homeScreen['DownButton'] = this.createButton('Nächste\nSeite', 5, 5, 1, () => {});

        homeScreen['ScreenToggleButtonList'] = screenToggleButtonList;
        
        this._screens['Home'] = homeScreen;

        // Properties

        let propertiesScreen = {};

        let propertiesToggleButton = this.createToggleButton('Eigenschaften', 5, 1, 1, () => {
            this.showScreen('Properties');
        });
        propertiesSubScreenToggleButtonList.addToggleButton(propertiesToggleButton);
        propertiesSubScreenToggleButtonList.addToggleButton(this.createToggleButton('Bewegen', 5, 2, 1, () => { this.showScreen('Move'); }));
        propertiesSubScreenToggleButtonList.addToggleButton(this.createToggleButton('Rotieren', 5, 3, 1, () => { this.showScreen('Rotate'); }));
        propertiesSubScreenToggleButtonList.addToggleButton(this.createToggleButton('Skalieren', 5, 4, 1, () => { this.showScreen('Scale'); }));

        propertiesScreen['HasGeometryButton'] = this.createCheckBoxToggleButton(1, 2, 1, () => {});

        propertiesScreen['ScreenToggleButtonList'] = screenToggleButtonList;
        propertiesScreen['PropertiesSubScreenToggleButtonList'] = propertiesSubScreenToggleButtonList;
        
        this._screens['Properties'] = propertiesScreen;

        // Move

        let moveScreen = {};

        let xToggleButton = this.createToggleButton('X', 1, 1, 1, () => { });
        coordinatesToggleButtonList.addToggleButton(xToggleButton);
        coordinatesToggleButtonList.addToggleButton(this.createToggleButton('Y', 1, 2, 1, () => { }));
        coordinatesToggleButtonList.addToggleButton(this.createToggleButton('Z', 1, 3, 1, () => { }));

        moveScreen['ScreenToggleButtonList'] = screenToggleButtonList;
        moveScreen['PropertiesSubScreenToggleButtonList'] = propertiesSubScreenToggleButtonList;
        moveScreen['CoordinatesToggleButtonList'] = coordinatesToggleButtonList;

        let manipulateButtons = {
            '+10' : this.createButton('+10', 1, 4, 1, () => {}),
            '+1' : this.createButton('+1', 2, 4, 1, () => {}),
            '+0,1' : this.createButton('+0,1', 3, 4, 1, () => {}),
            '+0,01' : this.createButton('+0,01', 4, 4, 1, () => {}),
            '-10' : this.createButton('-10', 1, 5, 1, () => {}),
            '-1' : this.createButton('-1', 2, 5, 1, () => {}),
            '-0,1' : this.createButton('-0,1', 3, 5, 1, () => {}),
            '-0,01' : this.createButton('-0,01', 4, 5, 1, () => {}),
        };
        Object.entries(manipulateButtons).forEach((entry) => { moveScreen[entry[0]] = entry[1]; });

        this._screens['Move'] = moveScreen;

        // Rotate

        let rotateScreen = {};

        rotateScreen['ScreenToggleButtonList'] = screenToggleButtonList;
        rotateScreen['PropertiesSubScreenToggleButtonList'] = propertiesSubScreenToggleButtonList;
        rotateScreen['CoordinatesToggleButtonList'] = coordinatesToggleButtonList;
        Object.entries(manipulateButtons).forEach((entry) => { rotateScreen[entry[0]] = entry[1]; });

        this._screens['Rotate'] = rotateScreen;

        // Scale

        let scaleScreen = {};

        scaleScreen['ScreenToggleButtonList'] = screenToggleButtonList;
        scaleScreen['PropertiesSubScreenToggleButtonList'] = propertiesSubScreenToggleButtonList;
        scaleScreen['CoordinatesToggleButtonList'] = coordinatesToggleButtonList;
        Object.entries(manipulateButtons).forEach((entry) => { scaleScreen[entry[0]] = entry[1]; });

        this._screens['Scale'] = scaleScreen;

        // Vorauswahl

        propertiesToggleButton.handleButtonDown();
        homeToggleButton.handleButtonDown();
        xToggleButton.handleButtonDown();
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