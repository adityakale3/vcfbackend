var verifyHeaders = async (req, res, next) => {
  if (req.headers["special"] === process.env.HEADER) {
    next();
  } else {
    return res.status(401).json("Unauthorised Request");
  }
};

module.exports = verifyHeaders;
