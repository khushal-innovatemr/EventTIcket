const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
    user_name:{
        type:String,
        required:true
    },
    Booking_id: {
        type: String,
        required: true
    },
    org:{
        type:String,
        required:true
    },
    Event_Date:{
        type:String,
        required:true,
    },
    Event_id: {
        type: String,
        required: true
    },
    Event_name:{
        type:String,
        required:true
    },
    date: {
        type: Date,
        default: Date.now
    },
    Ticket:{
        type:Number,
        required:true
    },
    Ticket_id:{
        type:String,
        required:true,
    },
    status:{
        type:String,enum:["pending","approved","rejected"],default:'pending'
    }
})

const Booking = mongoose.model("Booking",BookingSchema);
module.exports = Booking;