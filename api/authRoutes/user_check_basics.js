const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const con = require("../../config/mysql");

// Check Profile Img, Email Verification, Phone Updated
router.post("/check_basic", (req, res) => {
  // Get Data from post
  var userID = req.user.userID;

  // Query DB to get status
  var getQuery =
    "SELECT phoneuser, profileImgUser, emailVerified, isActive  FROM `users` WHERE ID = ?";
  var query = mysql.format(getQuery, [userID]);
  con.query(query, function (err, dbData) {
    // Verify Profile, Email, Phone
    var verify = {
      profile: false,
      email: false,
      phone: false,
      isactive: false,
    };

    if (dbData[0].phoneuser) {
      verify = { ...verify, phone: true };
    }
    if (dbData[0].profileImgUser) {
      verify = { ...verify, profile: true };
    }
    if (dbData[0].emailVerified) {
      verify = { ...verify, email: true };
    }
    if (dbData[0].isActive) {
      verify = { ...verify, isactive: true };
    }
    //
    //  Response // Send User All Data Basic Status
    //
    res.json({ err: false, msg: verify });
    // Send Response
  });
});

module.exports = router;
