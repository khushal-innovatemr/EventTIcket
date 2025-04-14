const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    sender:{type:String,required:true},
    text:{type:String,required:true},
    chat_id:{type:String,required:true}
})

const Chats = mongoose.model("chats",chatSchema); 
module.exports = Chats;