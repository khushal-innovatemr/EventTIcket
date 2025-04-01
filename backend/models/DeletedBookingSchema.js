const mongoose = require('mongoose');

const DeletedBookingSchema = new mongoose.Schema({
    Ticket_id: String,
    Event_id: String,
    User_id: String,
    Ticket: Number,
    DeletedAt: { type: Date, default: Date.now }
});

const DeletedBooking = mongoose.model('DeletedBooking', DeletedBookingSchema);
