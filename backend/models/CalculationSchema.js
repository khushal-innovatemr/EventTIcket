const mongoose = require('mongoose');

const Calculation_Schema = new mongoose.Schema({
    name:{type:String,required:true},
    org:{type:String,required:true},
    Ticket:{type:Number,required:true},
    ticket_price:{type:Number,required:true},
    Total_Amount:{type:Number,required:true},
   
})

const Calculation = mongoose.model("Amount_Collected",Calculation_Schema);
module.exports = Calculation;