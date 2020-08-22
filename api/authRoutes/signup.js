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
    body("username")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Username is required")
      .isLength({ min: 6, max: 50 })
      .withMessage("Username Length must be Between 6 - 50"),
    body("email", "Email is required")
      .trim()
      .isEmail()
      .not()
      .isEmpty()
      .withMessage("Email is required"),
    body("password", "Password is requried")
      .trim()
      .not()
      .isEmpty()
      .isLength({ min: 8, max: 50 })
      .withMessage("Password Legth must be Between 8 - 50")
      .custom((val, { req, loc, path }) => {
        if (val !== req.body.cpassword) {
          throw new Error("Passwords don't match");
        } else {
          return true;
        }
      }),
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
      res.json({
        title: "Login",
        message: `Error during Login`,
        error: errors.mapped(),
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
          // error checking user in db
          res.json({ err: true, msg: err });
        } else {
          // User query run successfully

          // checking users existance
          if (result.length) {
            res.json({ msg: "Email or username already exists" });
          } else {
            // No similar user found, code to add new user

            // BCRYPT PASSWORD
            bcrypt.hash(password, 10, function (err, hash) {
              let createUser = mysql.format(
                "INSERT INTO users (usernameuser, emailuser, passworduser) VALUES (?,?,?)",
                [username, email, hash]
              );
              con.query(createUser, (err1, result1) => {
                // error creating new user
                if (err1) {
                  res.json({
                    err: true,
                    msg: err1,
                  });
                } else {
                  // User created successfully
                  res.json({
                    msg: "User Created Successfully  :smiley:",
                    data: user,
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
