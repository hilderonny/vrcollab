// PostGRES und Pooling siehe https://stackabuse.com/using-postgresql-with-nodejs-and-node-postgres/

const router = require('express').Router();
const { Pool } = require('pg');
const pool = new Pool();

async function query(query, params) {
    const client = await pool.connect();
    return client.query(query, params);
}

/**
 * Löscht ein Element. Tut nix, wenn es das Element nicht gibt
 * DELETE /api/elements/:id
 */
router.delete('/:id', async(request, response) => {
    try {
        await query(`DELETE FROM elements WHERE id = $1;`, [ request.params.id ]);
        response.sendStatus(200);
    } catch (err) {
        response.sendStatus(400);
    }
});

/**
 * Liefert alle Element-IDs in der Datenbank als Feld.
 * GET /api/elements
 */
router.get('/', async(_, response) => {
    const result = await query(`SELECT id FROM elements;`);
    response.send(result.rows.map(r => r.id));
});

/**
 * Liefert ein Element oder null, wenn es dieses nicht gibt
 * GET /api/elements/:id
 */
router.get('/:id', async(request, response) => {
    try {
        const result = await query(`SELECT id, data FROM elements WHERE id = $1;`, [ request.params.id ]);
        if (result.rows.length > 0) {
            response.send(result.rows[0]);
        } else {
            response.sendStatus(404);
        }
    } catch (err) {
        response.sendStatus(400);
    }
});

/**
 * Erstellt ein neues Element und gibt es samt "id" Feld zurück
 * POST /api/elements
 */
router.post('/', async(request, response) => {
    const result = await query(`INSERT INTO elements (data) VALUES($1) RETURNING id, data`, [request.body]);
    response.send(result.rows[0]);
});

/**
 * Aktualisiert ein Element und gibt es zurück
 * PUT /api/elements/:id
 */
router.put('/:id', async(request, response) => {
    try {
        const result = await query(`UPDATE elements SET data = $1 WHERE id = $2 RETURNING id, data;`, [ request.body, request.params.id ]);
        if (result.rows.length > 0) {
            response.send(result.rows[0]);
        } else {
            response.sendStatus(404);
        }
    } catch (err) {
        response.sendStatus(400);
    }
});

module.exports = router;