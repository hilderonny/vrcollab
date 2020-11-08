// PostGRES und Pooling siehe https://stackabuse.com/using-postgresql-with-nodejs-and-node-postgres/

const bcrypt = require('bcrypt');
const router = require('express').Router();
const { Pool } = require('pg');
const pool = new Pool();

const tablesRepresentingEndpoints = [
    'geometries',
    'materials',
    'objects',
    'scenes',
    'users'
];

// Pool öffnen, Wuery absetzen, Pool schließen und Ergebnis zurück liefern
async function query(query, params) {
    const client = await pool.connect();
    var result = await client.query(query, params);
    client.release();
    return result;
}

/**
 * Löscht Datensatz. Erwartet {id:UUID} als Body. Liefert Status 200 zurück
 */
async function deleteElement(tableName, request, response) {
    try {
        await query(`DELETE FROM ${tableName} WHERE id = $1;`, [request.body.id]);
        response.sendStatus(200);
    } catch (err) {
        response.sendStatus(400);
    }
}

/**
 * Feld mit allen IDs der Entität
 */
async function getElementIds(tableName, response) {
    try {
        const result = await query(`SELECT id FROM ${tableName};`);
        response.send(result.rows.map(r => r.id));
    } catch (err) {
        console.error(err);
        response.sendStatus(400);
    }
}

/**
 * Liefert Entitäten für per Body übergebenes Array von IDs. Liefert {id:UUID,data:INHALT}.
 */
async function getElementsById(tableName, request, response) {
    try {
        const result = await query(`SELECT id, data FROM ${tableName} WHERE id = ANY($1);`, [ request.body ]); // https://github.com/brianc/node-postgres/wiki/FAQ#11-how-do-i-build-a-where-foo-in--query-to-find-rows-matching-an-array-of-values
        response.send(result.rows);
    } catch (err) {
        console.error(err);
        response.sendStatus(400);
    }
}

/**
 * Request body: { username: "...", password: "..." }
 * Liefert id bei Erfolg, nix bei Misserfolg
 */
async function login(request, response) {
    try {
        const resultExisting = await query(`SELECT id, password FROM users WHERE username = $1;`, [ request.body.username ]);
        if (resultExisting.rows.length < 1 || !bcrypt.compareSync(request.body.password, resultExisting.rows[0].password)) {
            response.sendStatus(403);
        } else {
            response.send(resultExisting.rows[0].id);
        }
    } catch (err) {
        console.error(err);
        response.sendStatus(400);
    }
}

/**
 * Request body: { username: "...", password: "..." }
 * Liefert id bei Erfolg, 403 bei Misserfolg
 */
async function register(request, response) {
    try {
        const resultExisting = await query(`SELECT id FROM users WHERE username = $1;`, [ request.body.username ]);
        if (resultExisting.rows.length > 0) {
            response.sendStatus(403);
        } else {
            const hash = bcrypt.hashSync(request.body.password, 10);
            const resultCreation = await query(`INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id;`, [ request.body.username, hash ]);
            response.send(resultCreation.rows[0].id);
        }
    } catch (err) {
        console.error(err);
        response.sendStatus(400);
    }
}

/**
 * Speichert einen Datensatz. Erwartet JSON mit {id:UUID,data:INHALT} als Body. Ohne id im Body wird neues Element erzeugt. Gibt id als Text zurück.
 */
async function saveElement(tableName, request, response) {
    if (request.body.id) {
        await query(`UPDATE ${tableName} SET data = $1 WHERE id = $2 RETURNING id, data;`, [request.body.data, request.body.id]);
        response.send(request.body.id);
    } else {
        const result = await query(`INSERT INTO ${tableName} (data) VALUES($1) RETURNING id;`, [request.body.data]);
        response.send(result.rows[0].id);
    }
}

function registerEndpoint(tableName) {
    router.post(`/${tableName}/deleteElement`, async (request, response) => deleteElement(tableName, request, response));
    router.post(`/${tableName}/getElementIds`, async (_, response) => getElementIds(tableName, response));
    router.post(`/${tableName}/getElementsById`, async (request, response) => getElementsById(tableName, request, response));
    router.post(`/${tableName}/saveElement`, async (request, response) => saveElement(tableName, request, response));
}

/**
 * Registriert alle API Endpunkte unter /api/elements/<TABELLE>/<AKTION>
 * 
 * Aufruf mit require('elements')(app);
 */
module.exports = async function(app) {
    // Liefert die Clientseitige Bibliothek aus (client.js)
    // GET /api/elements/lib
    router.get('/lib', async(_, response) => {
        response.sendFile(__dirname + '/client.js');
    });
    for (var tre of tablesRepresentingEndpoints) {
        // Datenbanktabellen anlegen, falls diese noch nicht existieren sollten
        await query(`CREATE TABLE IF NOT EXISTS ${tre} (id uuid DEFAULT uuid_generate_v4(), data json, PRIMARY KEY (id));`);
        // API Endpunkte registrieren
        registerEndpoint(tre);
    }
    // Für Benutzer sollen zusätzlich Benutzername und Passwort Felder angelegt werden
    await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS username text;`);
    await query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password text;`);
    router.post('/login', login);
    router.post('/register', register);
    app.use('/api/elements', router);
}