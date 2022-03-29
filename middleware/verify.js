const user = require("../models/userModel");
const verifyCredentials = (req, res, next) => {
  user
    .findOne({
      email: req.body.email,
    })
    .exec((err, user) => {
      if (err) return res.status(500).send({ message: err.message });
      if (user)
        return res.status(400).send({ message: "Email already in use!" });
      next();
    });
};

const verify = verifyCredentials;

module.exports = verify;
