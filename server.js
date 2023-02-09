const express = require('express');
// const db = require('./db')
const cors = require('cors')
const app = express();


const mysql = require('mysql')
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "task_list"
})

db.on('error', function (err) {
    console.log("[mysql error]", err);
});

app.use(cors());
app.use(express.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

const PORT = 3004;


db.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + db.threadId);
});

// Route to get all tasks
app.get("/api/task", (req,res)=>{
    db.query("SELECT * FROM todo_list", (err,result)=>{
        if(err) {
        console.log(err)
        } 
    res.send(result)
    });   });


// Route for creating the task
app.post('/api/create', (req, res) => {

    const task = req.body.text;

    db.query("INSERT INTO todo_list (text) VALUES (?)", task, (err, result) => {
        if (err) {
            console.log(err)
        }
        console.log(result)
    });
})


// Route to delete a post
app.delete('/api/delete/:id', (req, res) => {
    const id = req.params.id;

    db.query("DELETE FROM todo_list WHERE id = ?", id, (err, result) => {
        if (err) {
            console.log(err)
        }
        console.log(result)
        res.send(result)
    })
})



app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
}); 