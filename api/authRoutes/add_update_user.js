const express = require('express');
const router = express.Router();

// Add User Data
router.get('/add_data', (req,res) => {
    // Get Data from post
    // var username = req.params.username;

    // Save Data

    // Acknowledge Response

    // Send Response

    res.send(`Add Data API | Protected Route`);
});


// Update User Data
router.get('/update_data', (req,res) => {
    // Get Data from post
    // var username = req.params.username;

    // Save Data

    // Acknowledge Response

    // Send Response

    res.send(`Update Data API | Protected Route`);
});


module.exports = router;