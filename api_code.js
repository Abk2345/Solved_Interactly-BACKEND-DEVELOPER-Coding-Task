const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.json());

// Import the dotenv library
require('dotenv').config();

// Use the environment variables in your application
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;


const connection = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName
});

//fields in database are in contact database table:
// first_name, last_name, display_name, avatar, job_title, city, state 

//making the table in mysql workbench
//CREATE TABLE contact (
//     id INT AUTO_INCREMENT PRIMARY KEY,
//     first_name VARCHAR(50) NOT NULL,
//     last_name VARCHAR(50) NOT NULL,
//     display_name VARCHAR(100) NOT NULL,
//     avatar VARCHAR(100) DEFAULT NULL,
//     job_title VARCHAR(100) DEFAULT NULL,
//     city VARCHAR(100) DEFAULT NULL,
//     state VARCHAR(100) DEFAULT NULL
//   );

//App is developed with database set on personal computer
// API: POST createContact(first_name, last_name, display_name, avatar, job_title, city, state )
// same data format as of https://developer.freshsales.io/api/#create_contact

app.post('/contacts', (req, res) => {
    const { first_name, last_name, display_name, avatar, job_title, city, state } = req.body;
    const sql = 'INSERT INTO contact (first_name, last_name, display_name, avatar, job_title, city, state) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [first_name, last_name, display_name, avatar, job_title, city, state], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        res.json({ message: 'contact created successfully' });
    });
});

// API: POST getContact(contact_id)
//get contact corresponding to a particular id in the database
app.get('/contacts/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM contact WHERE id = ?';
    connection.query(sql, [id], (error, results) => {
        if (error) {
            return res.status(500).json({ error });
        }
        if (!results.length) {
            return res.status(404).json({ error: 'contact not found' });
        }
        res.json(results[0]);
    });
});

//Bonus api to get all contacts and visualise in the postman 
app.get('/all_contacts', (req, res) => {
    const sql = 'SELECT * FROM contact';
    connection.query(sql, (error, results) => {
        if (error) {
            console.log("Error in updating", error)
        }   
        if (!results.affectedRows) {
            console.log("Could not find", results)
        }
        res.json(results);
    });
});

//updating the contact corresponding to any particular id
// POST updateContact(contact_id, first_name, last_name, display_name, avatar, job_title, city, state )
app.put('/contacts/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, display_name, avatar, job_title, city, state } = req.body;
    const sql = 'UPDATE contact SET first_name = ?, last_name = ?, display_name = ?, avatar = ?, job_title = ?, city = ?, state = ? WHERE id = ?';
    connection.query(sql, [first_name, last_name, display_name, avatar, job_title, city, state, id], (error, results) => {
        if (error) {
            console.log("Error in updating", error)
        }   
        if (!results.affectedRows) {
            console.log("Error in updating", )
        }
        res.json({ message: 'contact updated successfully' });
    });
});

//deleting any contact with a given id
// POST deleteContact(contact_id)
app.delete('/contacts/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM contact WHERE id = ?';
    connection.query(sql, [id], (error, results) => {
        if (error) {
            console.log("Error in deleting", error)
        }   
        if (!results.affectedRows) {
            console.log("Error in deleting", error)
        }
        res.json({ message: 'contact deleted successfully' });
    });
});


app.listen(3000, () => {
    console.log('API server started on port 3000');
});
