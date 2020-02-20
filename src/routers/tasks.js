const express = require('express')
const Task = require('../models/task')
const auth = require('../middlewars/auth')
const router = express.Router()




router.post('/tasks',auth,async (req,res)=>{
    const task = new Task({
        ...req.body,
        owner : req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

//GET / ?complmeted&sortby&limit&skip
router.get('/tasks',auth,async(req,res)=>{
    match = {}
    sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed==='true'
    }
    if(req.query.sortby){
        const parts = req.query.sortby.split('_')
        sort[parts[0]] = parts[1]==='desc'? -1:1
    }
    try {
        const tasks =await Task.find({owner :req.user._id,...match},null,{
            limit:parseInt(req.query.limit),
            skip:parseInt(req.query.skip)
            ,sort
        })
        res.send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/tasks/:id',auth,async(req,res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id,owner: req.user._id})
        //const task = await Task.findById(id)
        if(!task){
            res.status(404).send()
        }else{
            res.send(task)
        }
    }catch(e){
        res.status(404).send(e)
    }
})


router.patch('/tasks/:id',auth,async (req,res)=>{
    const allowedupdates = ['description','completed']
    const  updates = Object.keys(req.body)
    const isAValidUpdate = updates.every((update)=> allowedupdates.includes(update))
    if (!isAValidUpdate) {
        return res.status(400).send()
    }
    try {
        //const task = await Task.findByIdAndUpdate(req.params.id,req.body,{runValidators : true,new:true})
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(! task){
           return res.status(404).send()
        }
        updates.forEach((update)=> task[update]= req.body[update])
        await task.save()
        res.send(task)
     } catch (error) {
         res.status(500).send(error)
     }
})


router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        //const task =await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router