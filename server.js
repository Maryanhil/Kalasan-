const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'kalasan'  // Ensure the correct database name is used
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database.');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());  // For handling JSON data if needed in POST requests
app.use(express.static(path.join(__dirname, 'public')));  // Static files (CSS, JS)
app.use(cookieParser());
app.use(session({
    secret: 'your-secret-key', // Change this to a strong key
    resave: false,
    saveUninitialized: false, // Ensures sessions are not saved without any modifications
    cookie: { secure: false, maxAge: 60000 } // Check maxAge for session expiration
}));


// Serve signup.html
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Handle user registration
app.post('/signup', (req, res) => {
    const { username, email, password } = req.body; // Password received in plain text

    bcrypt.hash(password, 10, (err, hash) => { // Hash the plain text password
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send('Internal server error');
        }

        // Update the SQL query to use the correct column names
        const query = 'INSERT INTO tbl_user (username, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())';
        db.query(query, [username, email, hash], (err, result) => {
            if (err) {
                console.error('Error inserting user into database:', err);
                return res.status(500).send('Internal server error');
            }

            req.session.userId = result.insertId; // Store user ID in session
            res.redirect('/dashboard.html'); // Redirect to dashboard after successful sign-up
        });
    });
});

// Serve login page (login.html)
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


// Handle login
app.post('/login', (req, res) => {
    console.log('Received login request body:', req.body); // Add this for debugging

    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).send('Email and password are required.');
    }

    const query = 'SELECT * FROM tbl_user WHERE email = ?';
    db.query(query, [email], (err, result) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send('Internal server error');
            
        }

        console.log('Query result:', result);

        if (result.length > 0) {
            bcrypt.compare(password, result[0].password_hash, (err, isMatch) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    return res.status(500).send('Internal server error');
                }

                if (isMatch) {
                    req.session.userId = result[0].user_id;
                    console.log('Login successful');
                    res.redirect('/dashboard.html');
                } else {
                    res.status(401).send('Invalid credentials');
                }
            });
        } else {
            res.status(401).send('User not found');
        }
    });
});

app.post('/addTreeRecord', (req, res) => {
    const { tree_name, species, location, date_planted } = req.body;

    const query = 'INSERT INTO tbl_tree_record (tree_name, species, location, date_planted) VALUES (?, ?, ?, ?)';
    db.query(query, [tree_name, species, location, date_planted], (err, result) => {
        if (err) {
            console.error('Error inserting tree record:', err);
            return res.status(500).send('Internal server error');
        }
        console.log('Tree record added successfully');
        res.redirect('/dashboard');  // Redirect to dashboard after successful submission
    });
});



app.get('/logout', (req, res) => {
    // Check if a session exists
    if (req.session) {
        // Log session details for debugging
        console.log('Logging out, session:', req.session);

        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).send('Internal server error');
            }

            // Clear the session cookie
            res.clearCookie('connect.sid'); // 'connect.sid' is the default session cookie name
            console.log('Session destroyed, user logged out');
            
            // Redirect to signup page
            res.redirect('/index.html');
        });
    } else {
        // If no session exists, simply redirect to signup
        res.redirect('/index.html');
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
