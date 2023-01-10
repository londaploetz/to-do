const express = require('express');
const db = require('./db.js')
const cors = require('cors')

const app = express(); 
app.use(cors()); 
app.use(express.json())


module.exports = db;
app.post('/create',(req,res)=>{

const task = req.body.tast; 
    
    db.query("INSERT INTO todo-list (task) VALUES (?)"),  [task], (err, result) => {
        if (err) {
            console.log(err); 
        } else 
        res.send('Values Inserted')
    }
}); 

app.listen(3001, ()=>{
    console.log(`Server is running on 3001`)
}); 