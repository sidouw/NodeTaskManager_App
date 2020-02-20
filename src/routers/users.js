const express = require('express')
const User = require('../models/user')
const router = express.Router()
const auth = require('../middlewars/auth')
const multer = require('multer')
const sharp = require('sharp')
const {SendWelcome,SendGoodBy} = require('../emails/accounts')
const imgup = multer({
    limits:{
        fieldSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|PNG|JPG|JPEG)$/)){
           return cb(new Error('Please upload an image'))
        }
        cb(undefined,true)
    }
})


router.post('/users',async (req,res)=>{
    try {
        const user = new User(req.body)
        const token =  await user.genAuthtoken()
        SendWelcome(user.email,user.name)
        res.status(201).send({user,token})
    } catch (e) {
        res.status(400).send(e)
    }
    
})

router.post('/users/login',async(req,res)=>{
    try {
        const user=  await User.findByCredentials(req.body.email,req.body.password)
        const token =await user.genAuthtoken()
        res.send({user,token})
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/logout',auth,async(req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=> {req.token !== token})
        req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }

})
router.post('/users/LogoutAll',auth,async(req,res)=>{
    try {
        req.user.tokens = []
        req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})
router.post('/users/me/avatar',auth,imgup.single('avatar'),async (req,res)=>{
    try {
        req.user.avatar = await sharp(req.file.buffer).resize(256,256).png().toBuffer()
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
    
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.get('/users/me',auth,async(req,res)=>{

    try {
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/users/:id',async(req,res)=>{
    const id = req.params.id
    try {
        const user =await User.findById(id)
        if(! user){
            res.status(404).send
        }else{
            res.send(user)
        }
    } catch (error) {
        res.status(404).send(error)
    }
})

router.get('/users/:id/avatar',async (req,res)=>{
    try {
        const user =await User.findById(req.params.id)

        if(!user|| !user.avatar){
            throw new Error('No user or immage Found')
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    } catch (error) {
        res.status(404).send(error.message)
    }
})
router.patch('/users/me',auth,async (req,res)=>{

    const allowedupdates = ['age','email','name','password']
    const updates = Object.keys(req.body)
    const isAValidUpdate = updates.every((update)=> allowedupdates.includes(update))
    if (!isAValidUpdate) {
        return res.status(400).send()
    }
    try {
       updates.forEach((update)=>req.user[update] = req.body[update])
       await req.user.save()
       res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/users/me',auth,async(req,res)=>{
    try {
        await req.user.remove()
        SendGoodBy(req.user.email,req.user.name)
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/users/me/avatar',auth,async(req,res)=>{
    try {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router