const app = require('express')();


const fetchUser = require('./api/fetchUser.js'); 
const pingStats = require('./api/stats'); 

// Auth Routes
const login = require('./api/authRoutes/login'); 
const signup = require('./api/authRoutes/signup');
const statistics = require('./api/authRoutes/statistics');
const add_update_user = require('./api/authRoutes/add_update_user'); 


// Fetch user social and Private profiles
// Social profile :             /:username
// Private profile :            /:username/:privateKey
app.use('/user', fetchUser);

// Ping / Update user stats
// Ping Users stats             /pingstats
app.use('/api', pingStats);

// ------------
// Auth Routes
// ------------


// Login user                   /login
app.use('/api', login);

// Signup user                  /signup
app.use('/api', signup);

// Fetch Logged in users stats  /statistics
app.use('/api', statistics);

// Add / Update Loggedin user
// Add User Data                /add_data
// Update User Data             /update_data
app.use('/api', add_update_user);




app.get('/', (req,res) => {
    res.send("How u doin");
});


app.listen(3000 , () => {
    console.log("App Up and Running");
});