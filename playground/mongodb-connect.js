const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) =>{
    if(err){
         console.log('Cannot connect to mongodb')
    }
    else{
        console.log("Connected to mongodb server")
    }

    db.collection('Todos').insertOne({
        text:'Something to do',
        completed:false
    },(err,result) => {
        if(err){
            return console.log("unable to insert todo", err)
        }

        console.log(JSON.stringify(result.ops, undefined, 2))
    });

    db.collection('Users').insertOne({
        name:'Shiron',
        age:25,
        location:'Dartford'
    },(err,result) => {
        if(err){
            return console.log("unable to insert user", err)
        }
        console.log(JSON.stringify(result.ops, undefined, 2))
    });

    db.close();

});