const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const con = require("../../config/mysql");

// Fetch Personal Data
router.post("/fetch_user_personal", (req, res) => {
  // Get Data from post
  var userID = req.user.userID;

  // Query DB to get status
  var getQuery = "SELECT *  FROM `datapersonal` WHERE userID = ?";
  var query = mysql.format(getQuery, [userID]);
  con.query(query, function (err, dbData) {
    console.log(" Database Data : ", dbData);
    if (dbData.length > 0) {
      if (err) {
        //
        //  Response // error checking user in db
        //
        res.json({
          err: true,
          msg: "Connectivity Issue ERR - 500 ",
        });
      } else {
        //
        //  Response // Success , Sending all Data
        //
        res.json({
          err: false,
          msg: dbData[0],
        });
      }
    } else {
      //
      //  Response // No personal Data
      //
      res.json({
        err: true,
        msg: "No Data",
      });
    }
  });
});

// Fetch Contact Data
router.post("/fetch_user_contact", (req, res) => {
  // Get Data from post
  var userID = req.user.userID;

  // Query DB to get status
  var getQuery = "SELECT *  FROM `datacontact` WHERE userID = ?";
  var query = mysql.format(getQuery, [userID]);
  con.query(query, function (err, dbData) {
    console.log(" Database Data : ", dbData);
    if (dbData.length > 0) {
      if (err) {
        //
        //  Response // error checking user in db
        //
        res.json({
          err: true,
          msg: "Connectivity Issue ERR - 501 ",
        });
      } else {
        //
        //  Response // Success , Sending all Data
        //
        res.json({
          err: false,
          msg: dbData[0],
        });
      }
    } else {
      //
      //  Response // No Contact Data
      //
      res.json({
        err: true,
        msg: "No Data",
      });
    }
  });
});

// Fetch Social Data
router.post("/fetch_user_social", (req, res) => {
  // Get Data from post
  var userID = req.user.userID;

  // Query DB to get status
  var getQuery = "SELECT *  FROM `datasocial` WHERE userID = ?";
  var query = mysql.format(getQuery, [userID]);
  con.query(query, function (err, dbData) {
    console.log(" Database Data : ", dbData);
    if (dbData.length > 0) {
      if (err) {
        //
        //  Response // error checking user in db
        //
        res.json({
          err: true,
          msg: "Connectivity Issue ERR - 502 ",
        });
      } else {
        //
        //  Response // Success , Sending all Data
        //
        res.json({
          err: false,
          msg: dbData[0],
        });
      }
    } else {
      //
      //  Response // No Social Data
      //
      res.json({
        err: true,
        msg: "No Data",
      });
    }
  });
});

// Fetch UPI Data
router.post("/fetch_user_upi", (req, res) => {
  // Get Data from post
  var userID = req.user.userID;

  // Query DB to get status
  var getQuery = "SELECT *  FROM `dataupi` WHERE userID = ?";
  var query = mysql.format(getQuery, [userID]);
  con.query(query, function (err, dbData) {
    console.log(" Database Data : ", dbData);
    if (dbData.length > 0) {
      if (err) {
        //
        //  Response // error checking user in db
        //
        res.json({
          err: true,
          msg: "Connectivity Issue ERR - 503 ",
        });
      } else {
        //
        //  Response // Success , Sending all Data
        //
        res.json({
          err: false,
          msg: dbData[0],
        });
      }
    } else {
      //
      //  Response // No UPI Data
      //
      res.json({
        err: true,
        msg: "No Data",
      });
    }
  });
});

// Fetch Bank Data
router.post("/fetch_user_bank", (req, res) => {
  // Get Data from post
  var userID = req.user.userID;

  // Query DB to get status
  var getQuery = "SELECT *  FROM `databank` WHERE userID = ?";
  var query = mysql.format(getQuery, [userID]);
  con.query(query, function (err, dbData) {
    console.log(" Database Data : ", dbData);
    if (dbData.length > 0) {
      if (err) {
        //
        //  Response // error checking user in db
        //
        res.json({
          err: true,
          msg: "Connectivity Issue ERR - 504 ",
        });
      } else {
        //
        //  Response // Success , Sending all Data
        //
        res.json({
          err: false,
          msg: dbData,
        });
      }
    } else {
      //
      //  Response // No Bank Data
      //
      res.json({
        err: true,
        msg: "No Data",
      });
    }
  });
});
module.exports = router;
