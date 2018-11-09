const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  // verify, verifies and decodeds token
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(token);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: " Auth failedfailed"
    });
  }
};
