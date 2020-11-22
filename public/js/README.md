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
