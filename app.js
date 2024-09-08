const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const http = require('http'); // Add this
const socketio = require('socket.io'); // Add this

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const ejsMate = require('ejs-mate');

const flash = require('connect-flash');
const session = require('express-session');

const Mentor = require('./models/mentor_sch');
const Review = require('./models/review');
const { mentorSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

const userRoutes = require('./routes/users');
const mentorRoutes = require('./routes/mentors');
const reviewRoutes = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/mentor-sphere');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

// Create HTTP server and set up Socket.IO
const server = http.createServer(app);
const io = socketio(server);

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')));

// Validation middleware for mentors
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', userRoutes);
app.use('/mentors', mentorRoutes);
app.use('/mentors/:id/reviews', reviewRoutes);

// Chatbot logic with Socket.IO
io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('chatMessage', (msg) => {
        console.log('Message received: ', msg);

        // Simple bot response for demonstration
        const botResponse = "You asked: " + msg;
        socket.emit('botMessage', botResponse);
    });
});

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

// Catch-all for undefined routes
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// Error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).send(message);
});

// Start the server
server.listen(3000, () => {
    console.log('Serving on port 3000');
});
