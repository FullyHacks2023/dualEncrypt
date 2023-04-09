require('dotenv').config();
const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const cors = require('cors');

const { sessionMiddleware, sessionMiddlewareTemplate } = require('./middleware/session');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================== Templates ==========================
// DB connection
// ===============================================================
const connectDB = require('./db/connectDB');

connectDB();

// ========================== Templates ==========================
// Template setup
// ===============================================================
app.use('/static', express.static(path.join(__dirname, 'views/static')));
app.set('views', path.join(__dirname, 'views/templates'));
app.set('view engine', 'ejs');

// ========================== Express Session ==========================
// Express Session
// ===============================================================
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true, maxAge: 3600000 }
    })
);
app.get('/', async (req, res) => {
    if (req.session.userid) {
        // console.log(req.session.userid);
        res.redirect('/dashboard');
    } else {
        res.redirect('/auth');
    }
});
// ========================== Templates ==========================
// Auth templates
// ===============================================================

app.use('/auth', require('./routes/auth_template_routes'));
// ========================== Templates ==========================
// dashbaord templates
// ===============================================================

app.use('/dashboard', sessionMiddlewareTemplate, require('./routes/dashboard_template_routes'));
// ========================== APIs =======================
// setting APIs
// ===============================================================
app.use('/api/auth', require('./routes/auth_api'));
app.use('/api/data', sessionMiddleware, require('./routes/data_api'));

// ========================== Server setup =======================
// setting up server according to port
// ===============================================================
const PORT = process.env.SERVER_PORT || 1337;
const options = {
    key: fs.readFileSync(path.join(__dirname, './certs/key.pem')),
    cert: fs.readFileSync(path.join(__dirname, './certs/cert.pem'))
};
const sslServer = https.createServer(options, app);
sslServer.listen(PORT, () => {
    console.log(`Secure server is listening on port https://localhost:${PORT}`);
});
