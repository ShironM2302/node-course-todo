//external libraries
var request = require('supertest');
var expect = require('expect');
const {ObjectId} = require('mongodb');
const _ = require('lodash');

//local dependcies
var {app} = require('./../server.js');
var {Todo} = require('./../models/todo');

//dummy todo
const todos = [{
    _id: new ObjectId(),
    text:"Something to do"
},
{
    _id: new ObjectId(),
    text:"dinner date"
}];

//wiping database, and then adding dummy todo for relevant tests
beforeEach((done) => {
    Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
    }).then(() => done());
});

//test cases of post todo
describe('POST /todos', () => {
    //test case for creating a todo
    it('should create a new todo', (done) => {
        var text = "test todo text";
        request(app)
            .post('/todos')
            .send({text}) //make variable into object/json
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err,res) => {
                if(err){
                    return done(err);
                }
               
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create a todo with an inavild body data', (done) => {
        request(app)
        .post('/todos')
        .send({}) 
        .expect(400)
        .end((err,res) => {
            if(err){
                return done(err);
            }
            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => done(e));
        });

    });
});

//test cases of post todo
describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done)
    });
});

//test cases of GET by ID
describe('GET /todos/:id', () => {
    it('should return correct todo by id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`) //onhexstring function changes object to string
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text); //is response matching the dummy model above as we are looking for the first one
            })
            .end(done)
    });

    it('should return 404 if no todo is found', (done) => {
        var hexID = new ObjectId().toHexString();
        request(app)
            .get(`/todos/${hexID}`)
            .expect(404)
            .end(done)
    });

    it('should return 404 if non-obect ids around', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .end(done)
    });
});


//test cases of delete
describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexID = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${hexID}`) 
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexID); 
                console.log(res.body.todo);
            })
            .end((err, res)=>{
                if(err){
                    return done(err);
                }

            Todo.findById(hexID).then((todo) => {
                console.log("hi")
                expect(todo).toNotExist();
                done();
            }).catch((e) => done(e));
        });
    });

    it('should return 404 if no todo is found', (done) => {
        var hexID = new ObjectId().toHexString();
        request(app)
            .delete(`/todos/${hexID}`)
            .expect(404)
            .end(done)
    });

    it('should return 404 if object is invalid', (done) => {
        request(app)
            .delete(`/todos/123`)
            .expect(404)
            .end(done)
    });
});