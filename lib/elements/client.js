async function post(url, body) {
    return fetch(url, {
        method: 'POST',
        headers: { 
            'Content-type': 'application/json; charset=UTF-8',
            'x-user-id': localStorage.getItem('userId'),
        },
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

    // var userId = await login('furz', 'husten');
    login: async(username, password) => {
        var response = await post('/api/elements/login', { username: username, password: password });
        return response.status === 200 ? response.text() : null;
    },

    // var userId = await register('furz', 'husten');
    register: async(username, password) => {
        var response = await post('/api/elements/register', { username: username, password: password });
        return response.status === 200 ? response.text() : null;
    },

    // await saveElement('scenes', { data: { schnurzel: 'furzel' } });
    // await saveElement('scenes', { id: 'id1', data: { schnurzel: 'furzel' } });
    saveElement: async(tableName, element) => {
        var response = await post(`/api/elements/${tableName}/saveElement`, element);
        return response.text();
    },

}