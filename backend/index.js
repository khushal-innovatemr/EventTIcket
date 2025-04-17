const express = require('express');
const cors = require('cors');
const http = require('http'); 
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io'); 
const io = new Server(server, {
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

const router = require('./controllers/routers')
const routes = require('./controllers/event_router')
const PORT = 3000;

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:4200',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
}));

app.use(bodyParser.json());

app.use('/auth', router);
app.use('/event', routes);

app.get('/', (req, res) => {
    res.send("Hello Ji")
});

// io.on('connection', (socket) => {
//     console.log('New client connected');

//     socket.on('message', (data) => {
//         const messageWithSender = { ...data, senderId: socket.id };

//         io.emit('message', messageWithSender);
//     });

//     socket.on('disconnect', () => {
//         console.log('Client disconnected');
//     });
// });

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinRoom', (roomName) => {
        console.log(`${socket.id} joined room: ${roomName}`);
        socket.join(roomName); 
        socket.emit('message', { sender: 'System', text: `You have joined room: ${roomName}`, senderId: socket.id });
    });

    socket.on('roomMessage', ({ roomName, message, sender }) => {
        console.log(`Message from ${sender} to room ${roomName}:`, message);
        io.to(roomName).emit('message', { sender, text: message, senderId: socket.id });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`App has started on port ${PORT}`);
});

