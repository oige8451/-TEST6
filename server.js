const fs = require('fs');
const express = require('express');
const profileRoute = require('./routes/profile');
const clientSessions = require('client-sessions'); 
const http = require('http');
const https = require('https');
const helmet = require('helmet');
const app = express();

const HTTP_PORT = process.env.PORT || 8080;
const HTTPS_PORT = 4433;

const https_options = {
    key: fs.readFileSync(__dirname + '/server.key'),
    cert: fs.readFileSync(__dirname + '/server.crt'),
  };
  

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); 

app.use(express.urlencoded({extended: false}));

// Configure client-sessions
app.use(clientSessions({
    cookieName: 'session', 
    secret: 'your_secret_key', // Secret key to encrypt cookie
    duration: 24 * 60 * 60 * 1000, 
    activeDuration: 30 * 60 * 1000 
}));


// Use Helmet for security
app.use(helmet());

// Use the profile route
app.use('/', profileRoute);

// Sample login route for testing
app.get('/login', (req, res) => {
    res.render("login", {errorMsg:""});
});


app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (email === 'ooige1@myseneca.ca' && password === '12345') {
        req.session.user = { name: 'Tomi', email: 'ooige1@myseneca.ca', address: '123 Main St', password:'12345'};
        res.redirect('/profile');
    } else {
        res.render('login', { errorMsg: 'Invalid credentials' });
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});


http.createServer(app).listen(HTTP_PORT, () => {
    console.log(`http server listening on: ${HTTP_PORT}`);
  });

  https.createServer(https_options, app).listen(HTTPS_PORT, () => {
    console.log(`https server listening on: ${HTTPS_PORT}`);
  });
