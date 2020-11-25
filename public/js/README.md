# Bibliotheken

## Controls

Die Controls funktionieren generalisiert und senden Events, wenn Zeiger
auf Objekte treffen oder diese verlassen und wenn Buttons oder Tasten gedrückt bzw. losgelassen
werden.

Alle weitere Logik muss auf einer anderen Ebene ausgeführt werden.

Der Abschluss der Initialisierung der Controls wird ebenfalls durch Events benachrichtigt, weil diese
erst ziehmlich spät erfolgen können.

Bevor controls.init() aufgerufen wird, sollten demnach schon alle EventListener registriert worden sein.

|Event|Beschreibung|
|---|---|
|`Ready`|Wenn die Controller alle initialisiert wurden und verwendet werden können. Auf der *Quest* kommt das Event, wenn beie Handcontroller bereit sind, damit man 3D Objekte an diese dranhängen kann. Enthält den Typ des Controls, der die Platform darstellt.|
|`PointerEnter`|Wenn der Zeiger bei einer Bewegung ein Objekt trifft. Als Parameter ist das Objekt enthalten|
|`PointerLeave`|Wenn der Zeiger bei einer Bewegung ein Objekt verlässt. Als Parameter ist das Objekt enthalten|
|`PointerUpdate`|Wenn sich der Controllerzeiger bewegt hat|
|`ButtonDown`|Wenn ein Kopf an der Maus oder am VR-Controller gedrückt wurde oder wenn eine Taste auf der Tastatur gedrückt wurde oder wenn auf den Touch-Screen gedrückt wurde.|
|`ButtonUp`|Wenn eine Maustaste, eine Tastaturtaste, ein VR-Controller--Knopf oder der TouchScreen losgelassen wurde|

Die Events werden mit einem Parameter (data) gesendet.
- `buttonType`: Art der Event-Quelle (`Controls.ButtonType`)
- `button`: Code des Buttons

### Plattformen

Diese sind im `ready` Ereignis in der Eigenschaft `platform` hinterlegt.

- `desktop` - Tastatur und Maus
- `touch` - Smartphones, Tablets
- `xr-1` - VR - Gerät mit einem 3DoF Controller (Oculus Go)
- `xr-2` - VR - Gerät mit 2 3DoF Controller (Oculus Quest)
- `xr-hand` - VR - Gerät mit Hand-Tracking (noch nicht implementiert)

### Tastatur-Events

- `data.buttonType`: `Controls.ButtonType.Keyboard`
- `data.button`: Tastencode (KeyboardEvent.code)
- `data.key`: Tastenzeichen ('A' und 'a' wird unterschieden) (KeyboardEvent.key)

## Maus-Events

- `data.buttonType`: `Controls.ButtonType.Mouse`
- `data.button`: 0 = linke, 1 = mittlere, 2 = rechte Maustaste

## Touch-Events

Beim `ButtonDown` Event steht noch nicht fest, ob es ein Tippen oder ein Wischen wird.
Also mit Vorsicht genießen!

Generell kommen `PointerUpdate` und `ButtonDown/ButtonUp` kurz hintereinander. Damit kann man erkennen,
wo genau hingetippt wurde.

- `data.buttonType`: `Controls.ButtonType.Touch`

## Zeiger-Events

- `data`: Gibt [Intersection](https://threejs.org/docs/#api/en/core/Raycaster.intersectObject)-Objekt des nahesten Objektes zurück

# Beispielvorlage

```html
<!DOCTYPE html>
<html>
	<head>
        <meta charset="utf-8">
        <meta name="viewport" content="user-scalable=0">
        <style>
            html, body { width: 100%; height: 100%; overflow: hidden; padding: 0; margin: 0; }
            canvas { display: block; }
            vrbutton { position: fixed; z-index: 9999; top: 0; left: 0; right: 0; bottom: 0; color: red; background-color: rgba(0,0,0,.9); display: flex; justify-content: center; flex-direction: column; text-align: center; font-size: xxx-large; cursor: pointer; user-select: none; }
        </style>
        <script type="module">
            import { SceneTemplate } from '../js/scene.js';
            import { Cube, Cylinder, Sphere } from '../js/geometries.js';

            let sceneTemplate = new SceneTemplate();
            
            // ... Hier kommt der ganze individuelle Schnulli rein

            let cube = new Cube();
            cube.material.color.set('#4cd');
            cube.position.set(-1, .5, -3);
            cube.rotation.set(0, Math.PI / 4, 0);
            sceneTemplate.scene.add(cube);

            let cylinder = new Cylinder();
            cylinder.material.color.set('#fc5');
            cylinder.position.set(1, .75, -3);
            cylinder.scale.set(1, 1.5, 1);
            sceneTemplate.scene.add(cylinder);

            let sphere = new Sphere();
            sphere.material.color.set('#e25');
            sphere.position.set(0, 1.25, -5);
            sphere.scale.set(2.5, 2.5, 2.5);
            sceneTemplate.scene.add(sphere);

        </script>
    </head>
    <body></body>
</html>
```
