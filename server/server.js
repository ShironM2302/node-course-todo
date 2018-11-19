//external libraries
var express = require('express');
var bodyParser = require('body-parser');
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
    })
})

app.listen(3000, () => {
    console.log('started listening to port 3000');
})

module.exports = {app}