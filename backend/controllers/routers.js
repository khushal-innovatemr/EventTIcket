const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema');
const Event = require('../models/EventSchema')
const Bookings = require('../models/BookingSchema');
const { v4: uuidv4 } = require('uuid');
const db = require('../dbconfig');
const dotenv = require('dotenv');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const verify = require('../middleware/auth');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client('1015469568453-jr3b9jqs2ca014ta6h8s0o24l34ocruf.apps.googleusercontent.com');

db;
dotenv.config();

app.use(express.json())
app.use(bodyParser.json());

router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    const userId = uuidv4();

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).send({ error: "User Already Exists" });

        const hashed_password = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashed_password, userId: userId, role: role || "user" })
        await user.save();
        return res.send({ msg: "User Registered Succesfully" })
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Server Error" });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User Not Found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid Credentials" });

        const token = jwt.sign({ name: user.name, userId: user.userId, email: user.email, role: user.role }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: "24h" });

        res.cookie('userId', user.id, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'strict'
        }).send({
            message: 'Login Success',
            token: token,
            role: user.role,
        })
        console.log("cookies", req.cookies)
        console.log("cookies", req.cookies)

    }
    catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Server Error" })
    }
})

router.delete('/user-delete/:id', verify, async (req, res) => {
    const userId = req.params.id;
    const userRole = req.user.role;

    console.log(userId)
    console.log("Attempting to delete user with ID:", userId);

    if (userRole == 'organizer') {
        try {
            await Event.deleteMany({ organizer_id: userId });
            const user = await User.findOneAndDelete({ userId: userId });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json({ message: "User deleted successfully" });
        } catch (err) {
            console.error("Deleting user error:", err);
            res.status(500).json({ error: "Server Error" });
        }
    }
    else {
        try {
            await Bookings.deleteMany({ Booking_id: userId });
            await Event.deleteMany({ organizer_id: userId });
            const user = await User.findOneAndDelete({ userId: userId });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            res.json({ message: "User deleted successfully" });
        } catch (err) {
            console.error("Deleting user error:", err);
            res.status(500).json({ error: "Server Error" });
        }
    }

});

router.post('/google', async (req, res) => {
    const { credential,role } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: '1015469568453-jr3b9jqs2ca014ta6h8s0o24l34ocruf.apps.googleusercontent.com',
        });

        const payload = ticket.getPayload();
        const { sub, email, name} = payload;
        console.log(payload);

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                userId: sub,
                email,
                name,
                role: role, 
                password: '$2a$10$DUMMY_HASHED_PASSWORD' 
            });
            await user.save();
        }
        console.log(user.role);

        const token = jwt.sign(
            {
                name: user.name,
                userId: user.userId,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET || 'adshgadjahdjajkdakdasdhslkj',
            { expiresIn: '1d' }
        );

        res.cookie('userId', user.userId, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'strict'
        }).json({
            message: 'Google Login success',
            token: token,
            role: user.role
        });
    } catch (err) {
        console.error('Google login error:', err);
        res.status(401).json({ message: 'Invalid Google token' });
    }
});




module.exports = router;