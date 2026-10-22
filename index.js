const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();

// Create express app
const app = express();
const port = process.env.PORT || 3000;

// Create pool
const pool = new Pool(process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {rejectUnauthorized: false}
    }
    : {
        user: process.env.PSQL_USER,
        host: process.env.PSQL_HOST,
        database: process.env.PSQL_DATABASE,
        password: process.env.PSQL_PASSWORD,
        port: process.env.PSQL_PORT,
        ssl: {rejectUnauthorized: false}
    });

// Add process hook to shutdown pool
process.on('SIGINT', function() {
    pool.end();
    console.log('Application successfully shutdown');
    process.exit(0);
});
	 	 	 	
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    const data = {name: 'Mario'};
    res.render('index', data);
});

app.get('/user', async (req, res) => {
    try {
        const queryResult = await pool.query('SELECT * FROM teammembers;');
        res.render('user', {teammembers: queryResult.rows});
    } catch (error) {
        console.error('Failed to load team members:', error.message);
        res.status(503).send('Database unavailable. Check the database connection settings.');
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
