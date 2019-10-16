// EXPRESS SERVER

// IMPORTING MODULES
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const todoRoutes = express.Router();
const PORT = 4000;



// MONGOOSE CONNECTION
mongoose.connect('mongodb://127.0.0.1:27017/todos', {userNewUrlParser: true});
const connection = mongoose.connection;

connection.once('open', function() {
    console.log('Mongo DB connection established*********');
})

let Todo = require('./todo.model');

// API ROUTES
app.use(cors());
app.use(bodyParser.json());
app.use('/todos',todoRoutes);

todoRoutes.route('/').get(function(req,res) {
    todoRoutes.propfind(function(err,todos){
        if(err){
            console.log(err);
        } else {
            res.json(todos);
        }
    })
})

// GET REQUEST 
todoRoutes.route('/:id').get(function(req,res){
    let id = req.params.id;
    todoRoutes.findBYid(id, function(err, todo){
        res.json(todo);
    })
})

// POST REQUEST - ADD SINGLE ITEM TO MONGODB
todoRoutes.route('/add').post(function(req,res){
    let todo = new todo(req.body);
    todo.save().then(todo=>{
        res.status(200).json({'todo':'todo added successfully'});
    }).catch(err => {
        res.status(400).send('adding new todo failed');
    })
})

// PUT REQUEST - UPDATES SINGLE ITEM
todoRoutes.route('/update/:id').post(function(req, res) {
    Todo.findById(req.params.id, function(err, todo) {
        if (!todo)
            res.status(404).send("data is not found");
        else
            todo.todo_description = req.body.todo_description;
            todo.todo_responsible = req.body.todo_responsible;
            todo.todo_priority = req.body.todo_priority;
            todo.todo_completed = req.body.todo_completed;

            todo.save().then(todo => {
                res.json('Todo updated!');
            })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

app.listen(PORT, function() {
    console.log('Server running on Port: ' + PORT, '***********');
})
