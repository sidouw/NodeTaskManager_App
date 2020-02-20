const mongoose = require("mongoose")
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require("./task")


const userScheme = new mongoose.Schema({
    name :{
        type : String,
        trim : true,
        required : true
    },
    email :{
        type : String,
        trim :true,
        required : true,
        unique :true,
        validate(value){
            if(! validator.isEmail(value)){
                throw new Error ('invalid email')
            }
        }
    },
    password : {
        type : String,
        trim : true,
        required : true,
        validate(value){
            if (value.length<6 || value.includes('password')) {
                throw new Error('invalid Password')
            }
        }
    },
    age:{
        type : Number,
        default : 0,
        validate(val){
            if (val <0) {
                throw new Error('invalid age')
            }
        }
    },
    tokens :[{
        type: String,
        required :true
    }],
    avatar :{
        type : Buffer
    }
},{
    timestamps :true
})

userScheme.virtual('tasks',{
    ref : 'Task',
    localField :'_id',
    foreignField :'owner'
})
userScheme.methods.toJSON = function () {
    const userObject = this.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userScheme.methods.genAuthtoken = async function(){

    try {
        const token = jwt.sign({id:this._id.toString()},process.env.JWT_SECRET)
        this.tokens.push(token)
        await this.save()
        return token
    } catch (error) {
        throw error
    }
}
userScheme.statics.findByCredentials = async (email,password)=>{

    try {
        const user =await User.findOne({email})
    if(! user){
        throw new Error('Unable to login')
    }
    const isAMatch = await bcrypt.compare(password,user.password)
    if (! isAMatch) {
        throw new Error('Unable to login')
    }
    return user
    } catch (error) {
        throw Error(error)
    }
    
}
userScheme.pre('save',async function (next) {
    if(this.isModified('password')){
        try {
            this.password = await bcrypt.hash(this.password,8)
            next()
        } catch (error) {
            next()
        }
    }
    
})
userScheme.pre('remove',async function (next) {
    try {
        await Task.deleteMany({owner :this._id})
        next()
    } catch (error) {
        console.log(error)
    }
})

const User = mongoose.model('User',userScheme)

module.exports = User