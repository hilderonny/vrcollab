async function post(url, body) {
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: body ? JSON.stringify(body) : null
    });
}

export default {

    // await deleteElement('scenes', 'id1');
    deleteElement: async(tableName, id) => {
        return post(`/api/elements/${tableName}/deleteElement`, { id: id });
    },

    // var idList = await getElementIds('scenes');
    getElementIds: async(tableName) => {
        var response = await post(`/api/elements/${tableName}/getElementIds`);
        return response.json();
    },

    // var elementList = await getElementsById('scenes', [ 'id1', 'id2' ]);
    getElementsById: async(tableName, idList) => {
        var response = await post(`/api/elements/${tableName}/getElementsById`, idList);
        return response.json();
    },

    // await saveElement('scenes', { data: { schnurzel: 'furzel' } });
    // await saveElement('scenes', { id: 'id1', data: { schnurzel: 'furzel' } });
    saveElement: async(tableName, element) => {
        var response = await post(`/api/elements/${tableName}/saveElement`, element);
        return response.text();
    },

}