export default {

    /**
     * Element anhand seiner ID löschen
     */
    del: async (id) => {
        return fetch('/api/elements/' + id, { method: 'DELETE' });
    },

    /**
     * Liefert data - Inhalt des Elementes mit der gegebenen ID
     */
    get: async (id) => {
        var response = await fetch('/api/elements/' + id);
        return response.json();
    },

    /**
     * Liefert Array von existierenden Element-Ids
     */
    getIdList: async () => {
        var response = await fetch('/api/elements/');
        return response.json();
    },

    /**
     * Ohne Angabe von id wird ein neues Element erzeugt und dessen genereirte ID zurück gegeben.
     * Mit id wird das Element mit der id überschrieben und ebenfalls die id zurück gegeben.
     */
    save: async (element, id) => {
        // Neu oder bestehend
        if (id) { // Aktualisieren
            await fetch('/api/elements/' + id, { // Siehe https://stackoverflow.com/questions/40284338/javascript-fetch-delete-and-put-requests
                method: 'PUT',
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
                body: JSON.stringify(element)
            });
            return id;
        } else { // Neuanlage
            var response = await fetch('/api/elements/', {
                method: 'POST',
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
                body: JSON.stringify(element)
            });
            return await response.text();
        }
    },

}