const express = require("express");
const router = express.Router();
const { body, validationResult, matchedData } = require("express-validator");
const mysql = require("mysql");
const con = require("../../config/mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Login User
router.post(
  "/login",
  [
    body("email", "Email is required")
      .trim()
      .isEmail()
      .not()
      .isEmpty()
      .withMessage("Email is required")
      .isLength({ max: 100 }),
    // Check password not empty | Between 8 - 50 | equals confirm_password
    body("password", "Password is requried")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Password Empty"),
  ],
  (req, res) => {
    // get Validator errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //
      //  Response input values error
      //
      res.json({
        err: true,
        msg: errors.mapped(),
      });
    } else {
      // Get sanitized user Data into variables
      const user = matchedData(req);
      const { email, password } = user;

      var getQuery = "SELECT * FROM `users` WHERE emailuser = ?";
      var query = mysql.format(getQuery, [email]);
      con.query(query, function (err, dbData) {
        if (err) throw err;
        // ON DB DATA
        // CHECK IF USER WITH EMAIL EXIST
        if (dbData.length > 0) {
          // Bycrypt Check user.password with db.password

          try {
            bcrypt.compare(password, dbData[0].passworduser, (err1, result) => {
              if (err1) {
                //
                //  Response // error checking user in db
                //
                res.json({
                  err: true,
                  msg: "Connectivity Issue ERR - 200 ",
                });
              } else {
                console.log("Bycrypt password check result", result);
                // Genrate Token JWT Token for 1hr
                if (result) {
                  if (dbData[0].isActive) {
                    var token = jwt.sign(
                      { userID: dbData[0].ID, name: dbData[0].usernameuser },
                      process.env.JWT_SECRET,
                      { expiresIn: "1h" }
                    );
                    //
                    //  Response // Logged In successfully
                    //
                    res.json({ err: false, msg: token });
                  } else {
                    //
                    //  Response // InActive User
                    //
                    res.json({ err: true, msg: "User Deactivated" });
                  }
                } else {
                  //
                  //  Response // Logged In successfully
                  //
                  res.json({ err: true, msg: "Invalid Credentials" });
                }
              }
            });
          } catch (error) {
            console.log(error);
          }
        } else {
          //
          //  Response // Invalid credentials
          //
          res.json({ err: true, msg: "Invalid Credentials" });
        }
      });
    }
  }
);

module.exports = router;
