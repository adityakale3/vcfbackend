const express = require("express");
const router = express.Router();
const { body, validationResult, matchedData } = require("express-validator");
const mysql = require("mysql");
const con = require("../../config/mysql");
const bcrypt = require("bcrypt");

// Signup User Route
router.post(
  "/signup",
  [
    // Check username for not empty | username between 6 - 50
    body("username")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Username is required")
      .isLength({ min: 6, max: 50 })
      .withMessage("Username Length must be Between 6 - 50"),
    // Check email not empty | less than 100
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
      .isLength({ min: 8, max: 50 })
      .withMessage("Password Legth must be Between 8 - 50")
      .custom((val1, { req, loc, path }) => {
        if (val1 !== req.body.cpassword) {
          throw new Error("Passwords don't match");
        } else {
          return true;
        }
      }),
    // Check confirm_password | equals password
    body("cpassword", "Confirm Password is requried")
      .trim()
      .not()
      .isEmpty()
      .custom((val, { req, loc, path }) => {
        if (val !== req.body.password) {
          throw new Error("Passwords don't match");
        } else {
          return true;
        }
      }),
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
      const { username, email, password } = user;

      // Verify User exist in DB
      let checkUserinDB = mysql.format(
        "SELECT emailuser,usernameuser FROM users WHERE emailuser = ? OR usernameuser = ?",
        [email, username]
      );

      con.query(checkUserinDB, (err, result) => {
        if (err) {
          //
          //  Response // error checking user in db
          //
          res.json({ err: true, msg: "Connectivity Issue ERR - 100" });
        } else {
          // User query run successfully

          // checking users existance
          if (result.length) {
            //
            //  Response // users existance in db Duplicate entry
            //
            res.json({ err: true, msg: "Email or username already exists" });
          } else {
            // No similar user found, code to add new user

            // BCRYPT PASSWORD
            const salt = bcrypt.genSaltSync(10);
            bcrypt.hash(password, salt, function (err, hash) {
              let createUser = mysql.format(
                "INSERT INTO users (usernameuser, emailuser, passworduser) VALUES (?,?,?)",
                [username, email, hash]
              );
              con.query(createUser, (err1, result1) => {
                // error creating new user
                if (err1) {
                  //
                  //  Response // error creating new user
                  //
                  res.json({
                    err: true,
                    msg: "Connectivity Issue ERR - 101 " + err,
                  });
                } else {
                  // User created successfully
                  //
                  //  Response // USER CREATED successfully
                  //
                  res.json({
                    err: false,
                    msg: user,
                  });
                }
              });
            });
          }
        }
      });
    }
  }
);

module.exports = router;
