const express = require('express');
const router = express.Router();

// Fetch User Stats
router.get('/statistics', (req,res) => {
    
    // Fetch Stats

    // Send Response

    res.send(`Stats API | Protected Route`);
});


module.exports = router;