const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Function to check jwt
var verifyToken = async (req, res, next) => {
  // Must have special header
  if (req.headers["special"] === "Aditya") {
    var token = req.headers["x-access-token"] || "";
    console.log("Middlware Token", token);
    try {
      if (!token) {
        return res.status(401).json("You need to Login");
      }
      const decrypt = await jwt.verify(token, "secret key");
      req.user = {
        name: decrypt.name,
        email: decrypt.email,
      };
      next();
    } catch (err) {
      return res.status(500).json(err.toString());
    }
  } else {
    return res.status(401).json("Unauthorised Request");
  }
};

// Login User
router.post("/", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var token = jwt.sign({ email, name }, "secret key", {
    expiresIn: "1h",
  });
  res.json({ msg: `TEST API | Protected Route`, token });
});

router.get("/home", (req, res) => {
  res.json({ page: "Home" });
});

router.get("/protectedhome", verifyToken, (req, res) => {
  res.json({ page: "Protected Home", user: req.user.name });
});

module.exports = router;
