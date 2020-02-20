const mongoose = require("mongoose")

mongoose.connect(process.env.MONGDB_URL,{
    useNewUrlParser : true,
    useCreateIndex :true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('conected to db')
}).catch(()=>{
    console.log('failed to connect to db :')
})


