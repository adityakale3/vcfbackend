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

//
//
// UPDATE Contact Details
//
//
router.post(
  "/update_contact",
  [
    // Check personalPhone for not empty | max 20
    body("personalPhone")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Personal Phone is required")
      .isLength({ min: 10, max: 15 })
      .withMessage("Personal Phone Length must be between 10 - 15")
      .isMobilePhone("en-IN")
      .withMessage("Invalid Indian Phone Number"),
    // Check workphone for not empty | max 20
    body("workphone")
      .trim()
      .optional()
      .isLength({ min: 10, max: 15 })
      .withMessage("Work Phone Length must be between 10 - 15")
      .isMobilePhone("en-IN")
      .withMessage("Invalid Indian Phone Number"),
    // Check Phone
    body("phone")
      .trim()
      .isLength({ min: 10, max: 15 })
      .withMessage("Phone Length must be between 10 - 15")
      .optional({ checkFalsy: true })
      .isMobilePhone("en-IN")
      .withMessage("Invalid Indian Phone Number")
      .optional({ checkFalsy: true }),
    // Check pesonalEmail not empty | less than 100
    body("pesonalEmail", "Pesonal Email is required")
      .trim()
      .not()
      .isEmpty()
      .isEmail()
      .withMessage("Pesonal Email is required")
      .isLength({ max: 100 })
      .withMessage("Pesonal Email must be less than 100"),
    // Check workEmail | less than 100
    body("workemail")
      .trim()
      .optional()
      .isEmail()
      .optional({ checkFalsy: true })
      .isLength({ max: 100 })
      .withMessage("Pesonal Email must be less than 100")
      .optional({ checkFalsy: true }),
    // Check Email | less than 100
    body("email")
      .trim()
      .optional()
      .isEmail()
      .optional({ checkFalsy: true })
      .isLength({ max: 100 })
      .withMessage("Email must be less than 100")
      .optional({ checkFalsy: true }),
    // Check Website not empty | less than 100
    body("website")
      .trim()
      .optional()
      .isURL()
      .withMessage("Invalid Website Address")
      .optional({ checkFalsy: true })
      .isLength({ max: 100 })
      .withMessage("Webite must be less than 100")
      .optional({ checkFalsy: true }),
    // Check Personal Address not empty | less than 200
    body("personaladdress")
      .trim()
      .optional()
      .isLength({ max: 200 })
      .withMessage("Personal Address must be less than 200")
      .optional({ checkFalsy: true }),
    // Check Work Address not empty | less than 200
    body("workaddress")
      .trim()
      .optional()
      .isLength({ max: 200 })
      .withMessage("Work Address must be less than 200")
      .optional({ checkFalsy: true }),
    // Check personal Contact Whatsapp | less than 2
    body("personalwa")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Whatsapp status is required with Personal Number")
      .isInt()
      .isLength({ max: 2 })
      .withMessage("Whatsapp status for Personal Contact is Invalid"),
    // Check Work Contact Whatsapp | less than 2
    body("workwa")
      .trim()
      .optional()
      .isInt()
      .isLength({ max: 2 })
      .withMessage("Whatsapp status for Work Contact is Invalid")
      .optional({ checkFalsy: true })
      .custom((val, { req, loc, path }) => {
        if (req.body.workphone) {
          body("workwa")
            .not()
            .isEmpty()
            .withMessage("Required Work Whatsapp status");
          //throw new Error("Passwords don't match");
        } else {
          return val;
        }
      }),
    // Check Phone Contact Whatsapp | less than 2
    body("pwa")
      .trim()
      .optional()
      .isInt()
      .isLength({ max: 2 })
      .withMessage("Whatsapp status for Phone is Invalid")
      .optional({ checkFalsy: true })
      .custom((val1, { req, loc, path }) => {
        if (req.body.phone) {
          body("pwa")
            .not()
            .isEmpty()
            .withMessage("Required Phone Whatsapp status");
          //throw new Error("Passwords don't match");
        } else {
          return val1;
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
      const contactData = matchedData(req);
      // console.log("All Data Update", contactData);
      const {
        personalPhone,
        workphone,
        phone,
        pesonalEmail,
        workemail,
        email,
        website,
        personaladdress,
        workaddress,
        personalwa,
        workwa,
        pwa,
      } = contactData;

      const userID = req.user.userID;
      let checkUserContact = "SELECT userID FROM datacontact WHERE userID = ?";
      var query = mysql.format(checkUserContact, [userID]);
      con.query(query, function (err, dbData) {
        if (err) {
          //
          //  Response // error checking user in db
          //
          res.json({
            err: true,
            msg: "Connectivity Issue ERR - 602 ",
          });
        } else {
          if (dbData.length > 0) {
            var user_contact =
              "UPDATE datacontact SET personalphone = ?, workphone = ?, phone = ?, pesonalEmail = ?, workemail = ?, email = ?, website = ?, personaladdress = ?, workaddress = ?, personalwa = ?, workwa = ?, pwa = ? WHERE userID = ?";
          } else {
            var user_contact =
              "INSERT INTO datacontact (personalphone, workphone, phone, pesonalEmail, workemail, email, website, personaladdress, workaddress, personalwa, workwa, pwa, userID) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
          }

          var finalQuery = mysql.format(user_contact, [
            personalPhone,
            workphone,
            phone,
            pesonalEmail,
            workemail,
            email,
            website,
            personaladdress,
            workaddress,
            personalwa,
            workwa,
            pwa,
            userID,
          ]);

          con.query(finalQuery, function (err1, dbStatus) {
            if (err1) {
              //
              //  Response // error Adding / Updating user Contact Data in db
              //
              res.json({
                err: true,
                msg: "Connectivity Issue ERR - 603 ",
              });
            } else {
              console.log(dbStatus);
              if (dbStatus.affectedRows === 1 || dbStatus.changedRows === 1) {
                //
                //  Response // Send Status of Update / Add Contact Data
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
    }
  }
);
module.exports = router;
