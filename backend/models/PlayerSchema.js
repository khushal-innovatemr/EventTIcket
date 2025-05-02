const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    id:{type:String,required:true},
    name:{type:String,required:true},
    team:{type:String,required:true},
})

const Players = mongoose.model("players",PlayerSchema);
module.exports = Players;

