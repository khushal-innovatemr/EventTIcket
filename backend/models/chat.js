const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    messages: [
        {
            sender: { type: String, required: true },
            text: { type: String, required: true },
        }
    ],
    chat_id: { type: String, required: true },
    date:{type:Date, default:Date.now }

});

const Chats = mongoose.model("Chats", chatSchema);
module.exports = Chats;