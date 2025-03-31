const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    role:{type:String,enum:["user","organizer","admin"],default:"user"},
    userId:{type:String,required:true}

})

const User = mongoose.model("User",UserSchema);
module.exports = User;

