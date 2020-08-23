const express = require("express");
const router = express.Router();
const { body, validationResult, matchedData } = require("express-validator");
const mysql = require("mysql");
const con = require("../../config/mysql");

// Add / Update User Personal Data
router.post(
  "/update_personal",
  [
    // Check firstName for not empty | max 100
    body("firstName")
      .trim()
      .not()
      .isEmpty()
      .withMessage("First Name is required")
      .isLength({ max: 100 })
      .withMessage("First Name Length must be less than 100"),
    // Check lastName for not empty | max 100
    body("lastName")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Last Name is required")
      .isLength({ max: 100 })
      .withMessage("Last Name Length must be less than 100"),
    body("middleName")
      .trim()
      .optional()
      .isLength({ max: 100 })
      .withMessage("Middle Name Length must be less than 100"),
    // Check email not empty | less than 100
    body("profession", "Profession is required")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Profession is required")
      .isLength({ max: 100 })
      .withMessage("Profession Length must be Between 6 - 100"),
    // Check password not empty | Between 8 - 50 | equals confirm_password
    body("company")
      .trim()
      .optional()
      .isLength({ max: 100 })
      .withMessage("Company Length must not be more than 100"),
    // Check confirm_password | equals password
    body("dob").trim().optional().isDate().withMessage("Invalid Date"),
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
      const personalData = matchedData(req);
      const {
        firstName,
        lastName,
        middleName,
        profession,
        company,
        dob,
      } = personalData;

      const userID = req.user.userID;
      let checkUserPersonal =
        "SELECT userID FROM datapersonal WHERE userID = ?";
      var query = mysql.format(checkUserPersonal, [userID]);
      con.query(query, function (err, dbData) {
        if (err) {
          //
          //  Response // error checking user in db
          //
          res.json({
            err: true,
            msg: "Connectivity Issue ERR - 600 ",
          });
        } else {
          if (dbData.length > 0) {
            var user_personal =
              "UPDATE datapersonal SET firstName = ?, lastName = ?, middleName = ?, profession = ?, company = ?, dob = ? WHERE userID = ?";
          } else {
            var user_personal =
              "INSERT INTO datapersonal (firstName, lastName, middleName, profession, company, dob,userID) VALUES (?,?,?,?,?,?,?)";
          }

          var finalQuery = mysql.format(user_personal, [
            firstName,
            lastName,
            middleName,
            profession,
            company,
            dob,
            userID,
          ]);

          con.query(finalQuery, function (err1, dbStatus) {
            if (err1) {
              //
              //  Response // error Adding / Updating user Personal Data in db
              //
              res.json({
                err: true,
                msg: "Connectivity Issue ERR - 601 ",
                er: finalQuery,
                lastname: lastName,
              });
            } else {
              console.log(dbStatus);
              if (dbStatus.affectedRows === 1 || dbStatus.changedRows === 1) {
                //
                //  Response // Send Status of Update / Add Personal Data
                //
                res.json({
                  err: false,
                  msg: dbStatus,
                });
              }
            }
          });
        }
      });

      // Check if user data already present
      // If present Update
      // Else Add Data
    }
  }
);

module.exports = router;
