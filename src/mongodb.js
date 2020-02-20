const {MongoClient,ObjectID} = require("mongodb")



const connnectionURL = "mongodb://127.0.0.1:27017"
const dbname = "Task_Manager"


MongoClient.connect(connnectionURL,{useNewUrlParser : true},(error,client)=>{
    // if (error) {
    //     return console.log('unable to connect to the database '+error)
    // }
    // const db= client.db(dbname)

    // db.collection('users').insertOne({
    //     name : 'sidah',
    //     age : 21
    // })

    if(error){
        return console.log('unable to connect to db '+ error) 
    }

    const db = client.db(dbname)
    // db.collection('tasks').insertMany([{
    //     descrption : 'making the ship scene',
    //     completed : false
    // },{
    //     descrption : 'doing the blender course',
    //     completed : true
    // },{
    //     descrption : 'making the storage scene',
    //     completed : false
    // }],(error,result)=>{
    //     if (error){
    //         return console.log('failed to insert '+error)
    //     }
    //     console.log(result.ops)
    // })
    // db.collection('tasks').findOne({_id: new ObjectID("5e41dcc8b3d80e0b44c9f995")},(error,result)=>{
    //     console.log(result)
    // })
    // db.collection('tasks').find({'completed':false}).toArray((error,result)=>{
    //     console.log(result)
    // })
    // db.collection('tasks').updateMany({completed : false},{
    //     $set:{
    //         completed :true
    //     }
    // }).then((result)=>{
    //     console.log('data updated ')
    // }).catch((error)=>{
    //     console.log('data update failed ')
    // })
    
    // db.collection('tasks').deleteOne({descrption : 'doing the blender course'}).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })
})
