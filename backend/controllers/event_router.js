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
const Chat = require('../models/chat');
const nodemailer = require('nodemailer');
const Calculation_Schema = require('../models/CalculationSchema');
const Calculation = require('../models/CalculationSchema');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);

db;
dotenv.config();

app.use(express.json());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });
  
  transporter.verify((error, success) => {
    if (error) {
      console.log("SMTP Connection Error:", error);
    } else {
      console.log("SMTP Ready:", success);
    }
  })
  
  const sendWelcomeEmail = async (email, name,Event_id,Ticket,status) => {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Booking Status!',
      text: `Hi,${name}
      \n Your booking for Event ID: ${Event_id} with ${Ticket} tickets is ${status}.`,
      html: `<p>Hi ${name},</p><p>Your booking for Event ID: ${Event_id} with ${Ticket} tickets is ${status}.</p>`,
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log('Welcome email sent to:', email);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  
  }


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
        const ViewEvents = await Event.find({}, 'name org description Event_id Event_date ticket_price venue type avail_ticket image_url').sort({ Event_date: 1 });
        const eventsWithImageUrl = ViewEvents.map(event => ({
                ...event._doc,
                image_url: (event.image_url && event.image_url.data) ? `data:${event.image_url.contentType};base64,${event.image_url.data.toString('base64')}` : null
            }));
        return res.json({ events: eventsWithImageUrl, name: name ,role:role});

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


router.post('/cancel/:Ticket_id',async (req, res) => {
    try {
        const Ticket_id = req.params.Ticket_id;
        console.log(Ticket_id);
        
        const booking = await Booking.findOneAndDelete({ Ticket_id: Ticket_id });

        if (!booking) {
            return res.status(400).json({ message: "Booking not found" });
        }
        const event = await Event.findOne({ Event_id: booking.Event_id });
        
        if (!event) {
            return res.status(400).json({ message: "Event not found" });
        }
        event.avail_ticket += booking.Ticket;
        await event.save();

        res.status(200).json({ message: "Booking cancelled successfully" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred", error });
    }
});

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

router.get('/ticket', verify, async (req, res) => {
    try {
        const Users = req.user.name;
        const booking_id = req.user.userId;
        if(req.user.role === 'admin'){
            const pending_ticket = await Booking.find({ status: 'pending'});
            const bookingIds = pending_ticket.map(ticket => ticket.Booking_id);
            
            const users = await User.find({ userId: { $in: bookingIds } });
            const userName = users.map(u=>u.name);
            return res.json({ pendingTickets: pending_ticket, names: userName });
        }
        else{
            const generate_ticket = await Booking.find({ Booking_id: booking_id });
            if (!generate_ticket || generate_ticket.length === 0) {
                return res.status(200).json({ message: 'No Bookings Found for the user', name: Users });
            }
            const approvedTickets = generate_ticket.filter(ticket => ticket.status === 'approved');
            const pendingTickets = generate_ticket.filter(ticket => ticket.status === 'pending');
            return res.json({ tickets: approvedTickets,pendingTickets:pendingTickets, name: Users });
        }

    } catch (error) {
        console.error('Error fetching tickets:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});



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

router.post("/:Event_Id/events/payment-intent", verify, async (req, res) => {
    const { Ticket } = req.body;
    const { Event_Id } = req.params;

    try {
        const event = await Event.findOne({ Event_id: Event_Id });
        if (!event) {
            return res.status(400).json({ message: "Event Not Found" });
        }

        const total_cost = event.ticket_price * Ticket *100;
        console.log(total_cost);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: total_cost,
            currency: "inr",
            metadata: {
                Event_id: Event_Id,
                userId: req.user.userId,
                Event_name: event.name,
            },
        });

        if (!paymentIntent.client_secret) {
            return res.status(500).json({ message: "error creating payment intent" });
        }

        const response = {
            paymentIntentId: paymentIntent.id,
            client_secret: paymentIntent.client_secret.toString(),
            total_cost,
            Event_id: Event_Id,
            Event_date:event.Event_date,
            userId: req.user.userId,
            Event_name: event.name,
            email:req.user.email,
            name:req.user.name,
            venue:event.venue
        };
        return res.json({data:response});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});

router.post('/:Event_Id/events', verify, async (req, res) => {
    try {
        const { paymentIntentId, Ticket } = req.body;
        console.log('11111111111111111111111111111111111111111',req.body);
        
        const Event_id = req.params.Event_Id;
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (!paymentIntent) {
            return res.status(400).json({ message: "payment intent not found" });
        }

        if (paymentIntent.metadata.Event_id !== req.params.Event_Id ||
            paymentIntent.metadata.userId !== req.user.userId) {
            return res.status(400).json({ message: "payment intent mismatch" });
        }

        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({ message: `payment intent not succeeded. Status: ${paymentIntent.status}` });
        }

        const ticket_id = uuidv4();
        const event = await Event.findOne({ Event_id: Event_id });
        const organizer = await User.findOne({ userId: event.organizer_id });

        const newBooking = new Booking({
            ...req.body,
            Ticket_id: ticket_id,
            Ticket:Number(Ticket),   
            Booking_id: req.user.userId,
            org: organizer.name,
            Event_Date:event.Event_date,
            Event_name: event.name,
            Event_id: req.params.Event_Id,
            user_name: req.user.name,
            status: 'approved',
        });

        const total_cost = Ticket *event.ticket_price;

        const calculation = new Calculation({name:event.name,org:event.org,Ticket:Ticket,ticket_price:event.ticket_price,Total_Amount:total_cost });
        const existingBooking = await Calculation.findOne({name:event.name,org:event.org,ticket_price:event.ticket_price});
        
        event.avail_ticket -= Ticket
        console.log(event.avail_ticket);
        await Event.findOneAndUpdate({Event_id:Event_id},{avail_ticket:event.avail_ticket})
        await newBooking.save();
        
        if(existingBooking){
            existingBooking.Ticket += Number(Ticket);
            existingBooking.Total_Amount += total_cost;
            await existingBooking.save()
        }
        else{
            await calculation.save();
        }

        res.status(200).json({ message: "Booking successful" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "something went wrong" });
    }
});


router.get('/amount_collect',async(req,res) => {
    const view_amount = await Calculation.find({},'name org Ticket ticket_price Total_Amount')
    return res.json(view_amount);
})



router.post('/chats', async (req, res) => {
    try {
        const chat_id = uuidv4();
        const { messages } = req.body;

        const chats = new Chat({ messages, chat_id});
        await chats.save();

        return res.status(200).json({ msg: "Chats saved successfully", savedChats: chats });
    } catch (error) {
        console.error("Error saving chats:", error);
        res.status(500).json({ error: "Server error" });
    }
});


router.get('/chats',async(req,res) => {
    try {
        const view_chats = await Chat.find()
        console.log(view_chats);
        return res.json({ view_chats:view_chats});
    } catch (err) {
        console.error("View event error:", err);
        return res.status(500).json({ error: "Server Error" });
    }
})

module.exports = router;