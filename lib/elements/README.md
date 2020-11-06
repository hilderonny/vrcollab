# API elements

`server.js` ist der serverseitige Teil, der per Express eingebunden wird.

`client.js` wird per `/api/elements/lib` eingebunden:

```js
import elements from '/api/elements/lib';

// IDs aller Elemente laden
var ids = await elements.getIdList();

// Element-Details laden
var element = await elements.get(id);

// Element speichern, id wird zurück gegeben
var newElement = { "schnulli": "pupse" };
var id = await elements.save(newElement);

// Element speichern und überschreiben
var existingElement = { "faraffel": "honkytonk" };
await elements.save(existingElement, id);

// Element über seine ID löschen
await elements.del(id);
```

Volles Debugging-Beispiel:

```js
var ids = await elements.getIdList();
console.log(ids);
for (var id of ids) {
    var element = await elements.get(id);
    console.log(element);
}
var newElement = { 'trullala' : 'fullepulle' };
var id = await elements.save(newElement);
console.log(id);
console.log(await elements.getIdList());
console.log(await elements.get(id));
newElement.trullala = 'hoppsassa';
await elements.save(newElement, id);
console.log(await elements.get(id));
await elements.del(id);
console.log(await elements.getIdList());
```