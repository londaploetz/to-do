const express = require('express');
const cors = require('cors')
const app = express();
const path = require("path");

const mysql = require('mysql')

const db = mysql.createConnection({
    host: "us-cdbr-east-06.cleardb.net",
    user: "bfbdb1a52337ed",
    password: "b0eae117",
    database: "heroku_0b8d447bd5fb0d8"
})


db.on('error', function (err) {
    console.log("[mysql error]", err);
});

app.use(express.json());
app.use(cors());


// declare react files in build as static
app.use(express.static(path.join(__dirname, "build")));



const PORT = process.env.PORT || 3004;


db.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + db.threadId);
});

// Route to get all tasks
app.get("/api/task", (req, res) => {
    db.query("SELECT * FROM todo_list", (err, result) => {
        if (err) {
            console.log(err)
        }
        res.send(result)
    });
});


// Route for creating a task
app.post('/api/create', (req, res) => {

    const task = req.body.text;

    db.query("INSERT INTO todo_list (text) VALUES (?)", task, (err, result) => {
        if (err) {
            console.log(err)
        }
        res.send(result)
    });
})


// Route to delete a task
app.delete('/api/delete/:id', (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM todo_list WHERE id = ?", id, (err, result) => {
        if (err) {
            console.log(err)
        }
        console.log(result)
        res.send(result)
    });
});

// Route to delete all tasks
app.delete('/api/clear', (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM todo_list", id, (err, result) => {
        if (err) {
            console.log(err)
        }
        console.log(result)
        res.send(result)
    });
});

// Route to update task
app.put("/api/update", (req, res) => {
    const id = req.body.id;
    const text = req.body.text;
    db.query("UPDATE todo_list SET text = ? WHERE id = ?", [text, id], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            res.send(result);
        }
    });
});

// serve index.html from the build folder
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
  
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
}); 