var request = require('supertest');
var expect = require('expect');

var {app} = require('./../server.js');
var {Todo} = require('./../models/todo');

//wiping database, so test case below works every time
beforeEach((done) => {
    Todo.remove({}).then(() => done());
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
               
                Todo.find().then((todos) => {
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
                expect(todos.length).toBe(0);
                done();
            }).catch((e) => done(e));
        });

    });
});