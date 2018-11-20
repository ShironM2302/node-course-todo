//external libraries
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectId} = require('mongodb');
//local imports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req,res) => {
    //get text into model
    var todo = new Todo({
        text: req.body.text
    });

    //save model to databse
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e)
    });
});

app.get('/todos', (req,res) =>{
    Todo.find().then((todos)=>{
        res.send({todos})
    },(e) => {
        res.status(400).send(e)
    });
});

app.get('/todos/:id', (req,res) =>{
    //take KV's into id parameter
    var id = req.params.id;
    console.log(id);
    //if can't find id, return blank
    if(!ObjectId.isValid(id)){
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        console.log(e)
        res.status(404).send();
    });
});

app.listen(3000, () => {
    console.log('started listening to port 3000');
});

module.exports = {app}