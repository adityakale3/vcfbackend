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
      .optional({ checkFalsy: true })
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
      .optional({ checkFalsy: true })
      .isEmail()
      .optional({ checkFalsy: true })
      .isLength({ max: 100 })
      .withMessage("Pesonal Email must be less than 100")
      .optional({ checkFalsy: true }),
    // Check Email | less than 100
    body("email")
      .trim()
      .optional({ checkFalsy: true })
      .isEmail()
      .optional({ checkFalsy: true })
      .isLength({ max: 100 })
      .withMessage("Email must be less than 100")
      .optional({ checkFalsy: true }),
    // Check Website not empty | less than 100
    body("website")
      .trim()
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage("Invalid Website Address")
      .optional({ checkFalsy: true })
      .isLength({ max: 100 })
      .withMessage("Webite must be less than 100")
      .optional({ checkFalsy: true }),
    // Check Personal Address not empty | less than 200
    body("personaladdress")
      .trim()
      .optional({ checkFalsy: true })
      .isLength({ max: 200 })
      .withMessage("Personal Address must be less than 200")
      .optional({ checkFalsy: true }),
    // Check Work Address not empty | less than 200
    body("workaddress")
      .trim()
      .optional({ checkFalsy: true })
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
      .optional({ checkFalsy: true })
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

//
//
// UPDATE Social Details
//
//
router.post(
  "/update_social",
  [
    // Check facebook for URL | max 120
    body("facebook")
      .trim()
      .isLength({ max: 120 })
      .withMessage("Length must max 120")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage("Invalid URL")
      .optional({ checkFalsy: true }),
    // Check twitter for URL | max 120
    body("twitter")
      .trim()
      .isLength({ max: 120 })
      .withMessage("Length must max 120")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage("Invalid URL")
      .optional({ checkFalsy: true }),
    // Check instagram for URL | max 120
    body("instagram")
      .trim()
      .isLength({ max: 120 })
      .withMessage("Length must max 120")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage("Invalid URL")
      .optional({ checkFalsy: true }),
    // Check linkedin for URL | max 120
    body("linkedin")
      .trim()
      .isLength({ max: 120 })
      .withMessage("Length must max 120")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage("Invalid URL")
      .optional({ checkFalsy: true }),
    // Check youtube for URL | max 150
    body("youtube")
      .trim()
      .isLength({ max: 150 })
      .withMessage("Length must max 150")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage("Invalid URL")
      .optional({ checkFalsy: true }),
    // Check telegram for URL | max 100
    body("telegram")
      .trim()
      .isLength({ max: 100 })
      .withMessage("Length must max 100")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage("Invalid URL")
      .optional({ checkFalsy: true }),
    // Check github for URL | max 120
    body("github")
      .trim()
      .isLength({ max: 120 })
      .withMessage("Length must max 120")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage("Invalid URL")
      .optional({ checkFalsy: true }),
    // Check slack for URL | max 120
    body("slack")
      .trim()
      .isLength({ max: 120 })
      .withMessage("Length must max 120")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage("Invalid URL")
      .optional({ checkFalsy: true }),
    // Check discord for URL | max 120
    body("discord")
      .trim()
      .isLength({ max: 120 })
      .withMessage("Length must max 120")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage("Invalid URL")
      .optional({ checkFalsy: true }),
    // Check snapchat for URL | max 120
    body("snapchat")
      .trim()
      .isLength({ max: 120 })
      .withMessage("Length must max 120")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage("Invalid URL")
      .optional({ checkFalsy: true }),
    // Check personalweb1 for URL | max 120
    body("personalweb1")
      .trim()
      .isLength({ max: 120 })
      .withMessage("Length must max 120")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage("Invalid URL")
      .optional({ checkFalsy: true }),
    // Check personalweb2 for URL | max 120
    body("personalweb2")
      .trim()
      .isLength({ max: 120 })
      .withMessage("Length must max 120")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage("Invalid URL")
      .optional({ checkFalsy: true }),
    // Check personalweb3 for URL | max 120
    body("personalweb3")
      .trim()
      .isLength({ max: 120 })
      .withMessage("Length must max 120")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage("Invalid URL")
      .optional({ checkFalsy: true }),

    // Check namepersonalweb1 for max 50
    body("namepersonalweb1")
      .trim()
      .isLength({ max: 50 })
      .withMessage("Length must max 50")
      .optional({ checkFalsy: true }),
    // Check namepersonalweb2 for max 50
    body("namepersonalweb2")
      .trim()
      .isLength({ max: 50 })
      .withMessage("Length must max 50")
      .optional({ checkFalsy: true }),
    // Check namepersonalweb3 for max 50
    body("namepersonalweb3")
      .trim()
      .isLength({ max: 50 })
      .withMessage("Length must max 50")
      .optional({ checkFalsy: true }),

    // Check pubgm for URL | max 15
    body("pubgm")
      .trim()
      .isLength({ max: 15 })
      .withMessage("Length must max 15")
      .optional({ checkFalsy: true })
      .isInt()
      .withMessage("Invalid PUBG ID"),
    // Check pubgname for URL | max 30
    body("pubgname")
      .trim()
      .isLength({ max: 30 })
      .withMessage("Length must max 30")
      .optional({ checkFalsy: true }),
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
      // Get sanitized user Social Data into variables
      const socialData = matchedData(req);
      // console.log("All Data Update", socialData);
      const {
        facebook,
        twitter,
        instagram,
        linkedin,
        youtube,
        telegram,
        github,
        slack,
        discord,
        snapchat,
        pubgm,
        pubgmname,
        personalweb1,
        namepersonalweb1,
        personalweb2,
        namepersonalweb2,
        personalweb3,
        namepersonalweb3,
      } = socialData;

      const userID = req.user.userID;
      let checkUserSocial = "SELECT userID FROM datasocial WHERE userID = ?";
      var query = mysql.format(checkUserSocial, [userID]);
      con.query(query, function (err, dbData) {
        if (err) {
          //
          //  Response // error checking user in db
          //
          res.json({
            err: true,
            msg: "Connectivity Issue ERR - 604 ",
          });
        } else {
          if (dbData.length > 0) {
            var user_social =
              "UPDATE datasocial SET facebook = ?, twitter = ?, instagram = ?, linkedin = ?, youtube = ?, telegram = ?, github = ?, slack = ?, discord = ?, snapchat = ?, pubgm = ?, pubgmname = ?, personalweb1 = ?, namepersonalweb1 = ?, personalweb2 = ?, namepersonalweb2 = ?, personalweb3 = ?, namepersonalweb3 = ?  WHERE userID = ?";
          } else {
            var user_social =
              "INSERT INTO datasocial `datasocial`(`facebook`, `twitter`, `instagram`, `linkedin`, `youtube`, `telegram`, `github`, `slack`, `discord`, `snapchat`, `pubgm`, `pubgmname`, `personalweb1`, `namepersonalweb1`, `personalweb2`, `namepersonalweb2`, `personalweb3`, `namepersonalweb3`,`userID`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
          }

          var finalQuery = mysql.format(user_social, [
            facebook,
            twitter,
            instagram,
            linkedin,
            youtube,
            telegram,
            github,
            slack,
            discord,
            snapchat,
            pubgm,
            pubgmname,
            personalweb1,
            namepersonalweb1,
            personalweb2,
            namepersonalweb2,
            personalweb3,
            namepersonalweb3,
            userID,
          ]);

          con.query(finalQuery, function (err1, dbStatus) {
            if (err1) {
              //
              //  Response // error Adding / Updating user Social Data in db
              //
              res.json({
                err: true,
                msg: "Connectivity Issue ERR - 605 ",
              });
            } else {
              console.log(dbStatus);
              if (dbStatus.affectedRows === 1 || dbStatus.changedRows === 1) {
                //
                //  Response // Send Status of Update / Add Social Data
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

//
//
// UPI Data Storing
//
//
router.post(
  "/update_upi",
  [
    // Check UPI for Validating | max 100
    body("upi")
      .trim()
      .isLength({ max: 100 })
      .withMessage("Length must max 100")
      .optional({ checkFalsy: true })
      .custom((val, { req, loc, path }) => {
        if (/^\w+@\w+$/.test(req.body.upi)) {
          throw new Error("Not a valid UPI");
        } else {
          return true;
        }
      }),
  ],
  (req, res) => {
    const userID = req.user.userID;
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
      const upiAll = matchedData(req);
      const { upi } = upiAll;
      // Verify User exist in DB
      let checkUserinDB = mysql.format(
        "SELECT userID FROM dataupi WHERE userID = ?",
        [userID]
      );

      con.query(checkUserinDB, (err, result) => {
        if (err) {
          //
          //  Response // error checking user in db
          //
          res.json({ err: true, msg: "Connectivity Issue ERR - 606" });
        } else {
          if (result.length) {
            var user_upi = "UPDATE dataupi SET upi = ?, WHERE userID = ?";
          } else {
            var user_upi = "INSERT INTO dataupi ( upi, userID ) VALUES (?,?)";
          }

          var finalQuery = mysql.format(user_upi, [upi, userID]);

          con.query(finalQuery, function (err1, dbStatus) {
            if (err1) {
              //
              //  Response // error Adding / Updating user UPI Data in db
              //
              res.json({
                err: true,
                msg: "Connectivity Issue ERR - 607 ",
              });
            } else {
              console.log(dbStatus);
              if (dbStatus.affectedRows === 1 || dbStatus.changedRows === 1) {
                //
                //  Response // Send Status of Update / Add UPI Data
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

//
//
// Bank Data Storing
//
//
router.post(
  "/update_bank",
  [
    // Check Bank Name for Validating Limit | max 100 | Alpha
    body("bankname")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Bank Name is required")
      .isLength({ max: 100 })
      .withMessage("Length must max 100")
      .isAlpha()
      .withMessage("Invalid Bank Name"),
    // Check Bank Account for Validating Limit | max 18 | Numeric
    body("bankaccount")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Bank Account Number is required")
      .isLength({ max: 18 })
      .withMessage("Length must max 18")
      .isInt()
      .withMessage("Invalid Bank Account Number"),
    // Check Bank IFSC for Validating Limit | max 11 | Aplha Numeric
    body("ifsc")
      .trim()
      .not()
      .isEmpty()
      .withMessage("IFSC Code is required")
      .isLength({ max: 11 })
      .withMessage("Length must max 11")
      .isAlphanumeric()
      .withMessage("Invalid IFSC Code"),
    // Check  Branch Name for Validating Limit | max 100 | Aplha Numeric
    body("branch")
      .trim()
      .isLength({ max: 100 })
      .withMessage("Length must max 100")
      .optional({ checkFalsy: true })
      .isAlphanumeric()
      .withMessage("No Special Characters allowed"),
  ],
  (req, res) => {
    const userID = req.user.userID;
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
      // Get sanitized Bank Data into variables
      const bankAll = matchedData(req);
      const { bankname, bankaccount, ifsc, branch } = bankAll;
      // Verify User exist in DB
      let checkUserinDB = mysql.format(
        "SELECT bankaccount FROM databank WHERE bankaccount = ? ",
        [bankaccount]
      );

      con.query(checkUserinDB, (err, result) => {
        if (err) {
          //
          //  Response // error checking user in db
          //
          res.json({ err: true, msg: "Connectivity Issue ERR - 608" });
        } else {
          if (result.length) {
            var user_bank =
              "UPDATE databank SET bankname = ?, bankaccount = ?, ifsc = ?, branch = ? WHERE userID = ?";
          } else {
            var user_bank =
              "INSERT databank (`bankname`, `bankaccount`, `ifsc`, `branch`, `userID`) VALUES (?,?,?,?,?)";
          }

          var finalQuery = mysql.format(user_bank, [
            bankname,
            bankaccount,
            ifsc,
            branch,
            userID,
          ]);

          con.query(finalQuery, function (err1, dbStatus) {
            if (err1) {
              //
              //  Response // error Adding / Updating user Bank Data in db
              //
              res.json({
                err: true,
                msg: "Connectivity Issue ERR - 609 ",
              });
            } else {
              console.log(dbStatus);
              if (dbStatus.affectedRows === 1 || dbStatus.changedRows === 1) {
                //
                //  Response // Send Status of Update / Add Social Data
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
