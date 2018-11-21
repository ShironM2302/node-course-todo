//external libraries
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectId} = require('mongodb');
const _ = require('lodash');

//local imports
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();
const port = process.env.PORT || 3000

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
        res.status(404).send();
    });
});

app.delete('/todos/:id', (req,res) => {
    var id = req.params.id;

    if(!ObjectId.isValid(id)){
        return res.status(404).send();
    }
    
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){
            res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(404).send();
    });
});

app.patch('/todos/:id', (req,res) => {
    var id = req.params.id;
    // user can only update what we set below
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectId.isValid(id)){
        return res.status(404).send();
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {$set:body}, {new:true}).then((todo) => {
        if(!todo){
            res.body.status(404).send();
        }
        res.body.status(200).send({todo})
    }).catch((e) => {
        res.status(404).send();
    })
})

app.listen(port, () => {
    console.log(`started listening to port ${port}`);
});

module.exports = {app}