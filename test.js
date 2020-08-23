const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const verifyToken = require("./api/authRoutes/checkAuth");
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

router.get("/protectedhome", verifyToken, (req, res) => {
  res.json({ page: "Protected Home", user: req.user });
});

module.exports = router;
