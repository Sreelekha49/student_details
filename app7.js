// CRUD operations of college_event table
// Database name: college
// Table name: college_event

// Initialize project:
// npm init -y
// npm install express mysql8

const express = require("express");
const mysql = require("mysql8");

const app = express();

app.use(express.json());

// Read HTML files from public folder
app.use(express.static("public"));

// Connect to college database
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "sree99",
    database: "college",
    port: 3306
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.log("MySQL connection error:", err.message);
        return;
    }

    console.log("Connected to MySQL");
});

// GET: Display all events
app.get("/events", (req, res) => {
    db.query(
        "SELECT * FROM college_event",
        (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }

            res.json(result);
        }
    );
});

// GET: Display one event
app.get("/events/:id", (req, res) => {
    db.query(
        "SELECT * FROM college_event WHERE event_id = ?",
        [req.params.id],
        (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }

            res.json(result);
        }
    );
});

// POST: Insert event
app.post("/events", (req, res) => {
    const {
        event_id,
        event_name,
        event_time,
        event_day,
        venue,
        description
    } = req.body;

    const sql = `
        INSERT INTO college_event
        (event_id, event_name, event_time, event_day, venue, description)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            event_id,
            event_name,
            event_time,
            event_day,
            venue,
            description
        ],
        (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }

            res.send("Event Inserted Successfully");
        }
    );
});

// PUT: Update event
app.put("/events/:id", (req, res) => {
    const {
        event_name,
        event_time,
        event_day,
        venue,
        description
    } = req.body;

    const sql = `
        UPDATE college_event
        SET event_name = ?,
            event_time = ?,
            event_day = ?,
            venue = ?,
            description = ?
        WHERE event_id = ?
    `;

    db.query(
        sql,
        [
            event_name,
            event_time,
            event_day,
            venue,
            description,
            req.params.id
        ],
        (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }

            if (result.affectedRows === 0) {
                return res.status(404).send("Event Not Found");
            }

            res.send("Event Updated Successfully");
        }
    );
});

// DELETE: Delete event
app.delete("/events/:id", (req, res) => {
    db.query(
        "DELETE FROM college_event WHERE event_id = ?",
        [req.params.id],
        (err, result) => {
            if (err) {
                return res.status(500).send(err.message);
            }

            if (result.affectedRows === 0) {
                return res.status(404).send("Event Not Found");
            }

            res.send("Event Deleted Successfully");
        }
    );
});

// Start server
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});