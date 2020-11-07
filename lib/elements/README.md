# API elements

Ich hatte zuerst nur die Tabelle "elements" gehabt.

Um den Konvertierungsaufwand zwischen ThreeJS und der Datenbank zu minimieren,
wollte ich die ThreeJS Strukturen direkt abbilden. Dazu brauche ich diese Tabellen
(alle in JSON-Format mit id, data):
- scenes
- objects
- geometries
- materials
- users

Die Tabellen dafür werden beim Hochfahren der API automatisch generiert.
Ebenso stellt die API selbst Endpunkte für genau diese Entitäten bereit.

```
/api/elements/<TABELLE>/<AKTION>
```

Ich benutze keine gesonderten HTTP-Methoden wie PUT oder DELETE, sondern
mache alles per POST mit JSON-Body.

Auch die Abfragen mache ich mit POST, damit ich dadurch bei Bedarf komplexe Filter
oder Listen von zu erhaltenden IDs übergeben kann.

|API Aktion|Beschreibung|
|---|---|
|deleteElement|Löscht Datensatz. Erwartet {id:UUID} als Body. Liefert Status 200 zurück|
|getElementIds|Feld mit allen IDs der Entität|
|getElementsById|Liefert Entitäten für per Body übergebenes Array von IDs. Liefert {id:UUID,data:INHALT}.|
|saveElement|Speichert einen Datensatz. Erwartet JSON mit {id:UUID,data:INHALT} als Body. Ohne id im Body wird neues Element erzeugt. Gibt id als Text zurück.|

`server.js` ist der serverseitige Teil, der per Express eingebunden wird.

`client.js` wird per `/api/elements/lib` eingebunden:

```js
import elements from '/api/elements/lib';

// IDs aller Szenen laden
var ids = await elements.getElementIds('scenes');

// Element-Details laden
var element = (await elements.getElementsById('scenes', [ id ]))[0];

// Element speichern, id wird zurück gegeben
var newElement = { data: { "schnulli": "pupse" } };
var id = await elements.saveElement('scenes', newElement);

// Element speichern und überschreiben
var existingElement = { id: id, data: { "faraffel": "honkytonk"} };
await elements.saveElement('scenes', existingElement);

// Element über seine ID löschen
await elements.deleteElement('scenes', id);
```

Volles Debugging-Beispiel:

```js
import elements from '/api/elements/lib';

var ids = await elements.getElementIds('scenes');
console.log(ids);
var scenes = await elements.getElementsById('scenes', ids);
console.log(scenes);
var newElement = { data: { trullala : 'fullepulle' } };
var id = await elements.saveElement('scenes', newElement);
console.log(id);
console.log(await elements.getElementIds('scenes'));
console.log((await elements.getElementsById('scenes', [id]))[0]);
newElement.id = id;
newElement.data.trullala = 'hoppsassa';
await elements.saveElement('scenes', newElement);
console.log((await elements.getElementsById('scenes', [id]))[0]);
await elements.deleteElement('scenes', id);
console.log(await elements.getElementIds('scenes'));
```