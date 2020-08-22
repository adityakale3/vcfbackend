const express = require("express");
const router = express.Router();

// Fetch Social Profile
router.get("/:username", (req, res) => {
  // Get Username
  var username = req.params.username;

  // Validate Username

  // Fetch Response

  // Send Response

  res.send(`Hi 😃 ${username}`);
});

// Fetch Private Profile
router.get("/:username/:privateKey", (req, res) => {
  // Get Username
  var username = req.params.username;
  var privateKey = req.params.privateKey;

  // Validate Username

  // Validate PrivateKey

  // Fetch Response

  // Send Response

  res.send(`${username} is private user`);
});

module.exports = router;
