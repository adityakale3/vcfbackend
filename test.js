const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const verifyToken = require("./api/authRoutes/checkAuth");
const { body, validationResult, matchedData } = require("express-validator");

// Login User
router.post("/", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var token = jwt.sign({ email, name }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ msg: `TEST API | Protected Route`, token });
});

router.get("/home", (req, res) => {
  res.json({ page: "Home" });
});

router.get(
  "/protectedhome",
  verifyToken,
  [
    body("website")
      .trim()
      .optional()
      .isURL()
      .isLength({ max: 100 })
      .withMessage("Website must be less than 100"),
  ],
  (req, res) => {
    const personalData = matchedData(req);
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
      res.json({ page: "Protected Home", user: req.user, final: personalData });
    }
  }
);

module.exports = router;
