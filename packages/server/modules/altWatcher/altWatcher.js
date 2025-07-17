const express = require('express');
const path = require('path');
const router = express.Router();
const { Pool } = require('pg');
const args = require('minimist')(process.argv.slice(2));
const { dbConfig } = require(args.DB_CONFIG || '../../config/db_config');
const pg = new Pool(dbConfig);
pg.connect();

module.exports = router;

const SQL_SELECT_LINK_APPROVED = `SELECT *
                                  FROM altwatcher_link
                                  WHERE lower(title) LIKE \'%\' || lower($1) || \'%\'
                                    AND manga & $2 >= $2
                                    AND anime & $3 >= $3
                                    AND ranobe & $4 >= $4
                                    AND approved = $5
                                  ORDER BY number_of_downloads DESC`;
const SQL_SELECT_LINK = `SELECT *
                         FROM altwatcher_link
                         WHERE lower(title) LIKE \'%\' || lower($1) || \'%\'
                           AND manga & $2 >= $2
                           AND anime & $3 >= $3
                           AND ranobe & $4 >= $4
                         ORDER BY number_of_downloads DESC`;
router.get('/link', async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    try {
        const { title = '', manga = 0, anime = 0, ranobe = 0, approved = true } = request.query;
        let links;
        console.log('---/link', [title, manga, anime, ranobe, approved]);

        if (approved === 'true') {
            let { rows } = await pg.query(SQL_SELECT_LINK_APPROVED, [title, manga, anime, ranobe, approved]);
            links = rows;
        } else {
            let { rows } = await pg.query(SQL_SELECT_LINK, [title, manga, anime, ranobe]);
            links = rows;
        }
        response.json(links);
    } catch (e) {
        console.error(e);
        response.sendStatus(500)
    }
});

const SQL_INSERT_LINK = `INSERT INTO altwatcher_link (title, link, description, manga, anime, ranobe)
                         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`;
router.post('/link', async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    try {
        const { title, link, description, manga = 0, anime = 0, ranobe = 0 } = request.body;
        if (!title) {
            response.status(400).json({ error: 'title is not present' });
            return;
        }
        if (!link) {
            response.status(400).json({ error: 'link is not present' });
            return;
        }


        let { rows: res } = await pg.query(SQL_INSERT_LINK, [title, link, description, manga, anime, ranobe]);
        console.log('---res', res);
        console.log('---res', Number(res[0].id));
        response.json({
            id: Number(res[0].id)
        });
    } catch (e) {
        console.error(e);
        response.sendStatus(500)
    }
});

const SQL_UPDATE_NUMBER_OF_DOWNLOADS = `UPDATE altwatcher_link
                                        SET number_of_downloads = number_of_downloads + 1
                                        WHERE id = $1; `;
router.get('/link/:linkId/inc-num-of-downloads', async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    try {
        let linkId = request.params.linkId;
        console.log(`/link/${linkId}/inc-num-of-downloads`);
        await pg.query(SQL_UPDATE_NUMBER_OF_DOWNLOADS, [linkId]);
        response.sendStatus(200)
    } catch (e) {
        console.error(e);
        response.sendStatus(500)
    }
});

const SQL_SELECT_DEFAULT = `SELECT * FROM altwatcher_link WHERE is_default = TRUE;`;
router.get('/defaultLinks', async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    try {
        console.log(`/defaultLinks`);
        let { rows } = await pg.query(SQL_SELECT_DEFAULT);
        response.json(rows);
    } catch (e) {
        console.error(e);
        response.sendStatus(500)
    }
});

router.get('/faq', async (request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    response.sendFile(path.join(__dirname, 'faq.md'))
});

/*Ошибки с постгресом*/
pg.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
});