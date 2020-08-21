const express = require('express');
const router = express.Router();

// Ping Stats
router.get('/pingstats', (req,res) => {
    // Get Data from post
    // var username = req.params.username;

    // Save to DB

    // Send Response

    res.send(`Ping Stats API`);
});


module.exports = router;