const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');
const { v4: uuidv4 } = require('uuid');
const db = require('../dbconfig');
const dotenv = require('dotenv');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const Event = require('../models/EventSchema');
const multer = require('multer');
const verify = require('../middleware/auth');
const Booking = require('../models/BookingSchema');

db;
dotenv.config();

app.use(express.json());
app.use(bodyParser.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/add-event',verify, upload.single('image'), async (req, res) => {
    const { name, Event_date, ticket_price, venue, description, type, avail_ticket} = req.body;
    const Event_id = uuidv4();
    const org = req.user.name;
    const organizer_id = req.user.userId;

    try {
        let event = await Event.findOne({ name });
        if (event) return res.status(400).send({ error: "Event Already Exists" });

        const imageData = req.file ? { data: req.file.buffer, contentType: req.file.mimetype } : null;

        event = new Event({ name,org,Event_date, Event_id,organizer_id,ticket_price, venue, description, type, image_url: imageData, avail_ticket });
        await event.save();
        return res.send({ msg: "Event Registered Successfully" });
    } catch (error) {
        console.error("Event Registration error:", error);
        res.status(500).json({ error: "Server Error" });
    }
});


router.get('/view-event',verify, async (req, res) => {
    try {
        const role = req.user.role;
        const name = req.user.name;
        const ViewEvents = await Event.find({}, 'name org description Event_id Event_date ticket_price venue type avail_ticket image_url').sort({ type: 1 });
        const eventsWithImageUrl = ViewEvents.map(event => ({
                ...event._doc,
                image_url: (event.image_url && event.image_url.data) ? `data:${event.image_url.contentType};base64,${event.image_url.data.toString('base64')}` : null
            }));
        return res.json({ events: eventsWithImageUrl, name: name });

    } catch (err) {
        console.error("View event error:", err);
        return res.status(500).json({ error: "Server Error" });
    }
});

router.get('/admin-view',verify, async (req, res) => {
    try {
        const role = req.user.role;
        const ViewEvents = await Event.find({}, 'name org description Event_id Event_date ticket_price venue type avail_ticket image_url').sort({ type: 1 });
        const eventsWithImageUrl = ViewEvents.map(event => ({
                ...event._doc,
                image_url: (event.image_url && event.image_url.data) ? `data:${event.image_url.contentType};base64,${event.image_url.data.toString('base64')}` : null
            }));
        return res.json(eventsWithImageUrl);
    } catch (err) {
        console.error("View event error:", err);
        return res.status(500).json({ error: "Server Error" });
    }
});

router.post('/book/:id', verify, async (req, res) => {
    try {
        const {Ticket} = req.body;
        const Booking_id = req.user.userId;
        const ticket_id = uuidv4();
        const evId = req.params.id; 
    
        
        const event = await Event.findOne({ Event_id: evId });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        const ab = event.name;
        const mb = event.org;
        const mc = event.Event_date;
        
        if (event.avail_ticket <= 0) {
            return res.status(400).json({ message: "No tickets available" });
        }

        if (Ticket>5){
            console.log("max tickets exceeded by",Ticket-5)
            return res.status(400).json({message:"No more tickets can be booked",Tickets_Exceeded_by:Ticket-5});
        }
        const existingBooking = await Booking.findOne({ Booking_id:Booking_id, Event_id: evId });
        // if (existingBooking) {
        //     return res.status(400).json({ message: "You have already booked the ticket" });
        // }

        const date = Date.now();
        const newBooking = new Booking({ Booking_id,org:mb, Event_id: evId,Event_Date:mc,Event_name:ab, date ,Ticket,Ticket_id:ticket_id});
        
        event.avail_ticket -= Ticket;
        const updateResult = await Event.updateOne({ Event_id: evId }, { avail_ticket: event.avail_ticket });

        await newBooking.save();
        res.status(200).json({ message: "Booking successful" });
    } catch (err) {
        console.error("Unable to book tickets", err);
        return res.status(500).json({ error: "Server Error" });
    }
});

router.post('/cancel/:id',async(req,res) => {
    try{
        const {Event_id,ticket_id,ticket} = req.params;
        const booking = await Booking.findOneAndDelete({Ticket_id:ticket_id});
        if (!booking) {
            return res.status(400).json({ message: "Booking not found" });
        }
        const event = await Event.findOne({ Event_id: evId });
        event.avail_ticket = event.avail_ticket
        await Event.updateOne({avail_ticket:avail_ticket});
        
        res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error });
    }
})

router.get('/views', verify, async (req, res) => {
    const role = req.user.role;
    console.log('x',role);        
    if (req.user.role === 'admin') {
      try {
        const users = await User.find({ role: { $in: ['user', 'organizer'] } }, 'name email role userId');
        return res.json(users);
      } catch (err) {
        console.error("Fetching users error:", err);
        res.status(500).json({ error: "Server Error" });
      }
    } else {
      res.status(403).json({ error: "Access denied" });
    }
  });

router.get('/ticket',verify,async(req,res) => {
    const organizer = req.user.name;
    const booking_id = req.user.userId;
    
    const generate_ticket = await Booking.find({Booking_id:booking_id})
    console.log(generate_ticket);
    if(!generate_ticket){
        return res.status(200).json({message:'No Bookings Found for the user',name:name})
    }
    return res.json({tickets:generate_ticket,name:organizer});
})


router.get('/organizer', verify, async (req, res) => {
    const booking_id = req.user.userId;
    const generate_ticket = await Event.find({ organizer_id: booking_id });
    
    if (!generate_ticket || generate_ticket.length === 0) {
        return res.status(200).json({ message: 'No Events Found for the organizer' });
    }

    const eventsWithImageUrl = generate_ticket.map(event => ({
        ...event._doc,
        image_url: (event.image_url && event.image_url.data) 
            ? `data:${event.image_url.contentType};base64,${event.image_url.data.toString('base64')}` 
            : null
    }));  

    return res.json(eventsWithImageUrl);
});


router.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        await Booking.deleteMany({Event_id:id});
        console.log(`Booking for all users with ${id} deleted succesfully`)
        const Event_Deleted = await Event.findOneAndDelete({ Event_id: id });

        if (!Event_Deleted) {
            console.log("Delete Failed");
            return res.json({ error: "Event Not Found" });
        }
        return res.json({ message: "Event Deleted Successfully" });
    } catch (err) {
        console.error(err);
        return res.json({ error: "Internal Server Error" });
    }
});


module.exports = router;