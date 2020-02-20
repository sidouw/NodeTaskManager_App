const express = require('express')
require('./db/mongoose')
const usersroute = require('./routers/users')
const tasksroute = require('./routers/tasks')



const app = express()

app.use(express.json())
app.use(usersroute)
app.use(tasksroute)

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log('listening on port '+PORT)
})


