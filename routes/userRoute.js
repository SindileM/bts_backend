// const dotenv = require("dotenv");
// dotenv.config();
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { obtainUser } = require("../middleware/obtainer.js");
const verifyAcc = require("../middleware/authJWT");
const nodemailer = require("nodemailer");

// GET
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", obtainUser, (req, res) => {
  res.json(res.user);
});


//Register

router.post("/signup", async (req, res) => {
  
    const passEncryption = bcrypt.hashSync(req.body.password, 8);
    console.log("We lost")
    const user = await new User({
      username: req.body.username,
      email: req.body.email,
      password: passEncryption,
    });
    console.log("Whats'up")
    console.log(user);
    try {
    const newUser = await user.save();
    // let transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.email,
    //     pass: process.env.pass,
    //   },
    // });
    // let mailOptions = {
    //   from: process.env.email,
    //   to: email,
    //   subject: `Welcome to The Army Blog, ${username}!`,
    //   text: `
    //     <h2>Hi current and future ARMY it's Sindile Here!.</h2>
    //     <h3>Thank you for signing up to my blog site!</h3>
    //     <h3>This blog is for a band that we know and love. BANGTAN SONYEONDAN commonly known as BTS.</h3>
    //     <h4>Just as they spread the message of self love and acceptance so should we.</h4>

    //     <h4>Happy blogging, ${username}</h4>

    //     <h6>Note: Do not reply to this email.</h6>
 
    //     <h6>The Army Blog.</h6>
    //   `,
    // };
    // transporter.sendMail(mailOptions, function (err, success) {
    //   if (error) {
    //     res.status(400).send({ message: err.message });
    //   } else {
    //     res.status(200).send({ message: "Email was sent successfully." });
    //   }
    // });
    console.log("We are here")
    res.status(200).send({ message: "Successfully created new user", newUser});
  } catch (error) {
    console.log("Why are we here")
    res.status(500).send(error.message);
  }
});

//Login

router.post("/signin", async (req, res) => {
  try {
    const verifyEmail = User.findOne({ email: req.body.email }, (err, user) => {
      if (!verifyEmail) return res.status(401).send({ message: err.message });
      if (!user) return res.sendStatus(404);
      const passMatch = bcrypt.compareSync(req.body.password, user.password);
      if (!passMatch) return res.sendStatus(404);
      const authToken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET);
      if (!authToken) return res.sendStatus(401);
      res.header("auth-token", authToken).send({
        _id: user._id,
        username: user.username,
        email: user.email,
        // ACCESS_TOKEN_SECRET: authToken,
        // profile: user.profile,
      });
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//Update

router.put("/:id", [verifyAcc, obtainUser], async (req, res) => {
  if (req.body.username != null) res.user.username = req.body.username;
  if (req.body.email != null) res.user.email = req.body.email;
  if (req.body.profile != null) res.user.profile = req.body.profile;
  if (req.body.password != null)
    res.user.password = bcrypt.hashSync(req.body.password, 8);
  try {
    const updateUser = await res.user.save();
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.pass,
      },
    });
    let mailOptions = {
      from: process.env.email,
      to: res.user.email,
      subject: `You have updated your profile, ${res.user.username}.`,
    };
    transporter.sendMail(mailOptions, function (err, success) {
      if (error) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(200).send({ message: "Email was sent successfully." });
      }
    });
    res.status(200).send(updateUser);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

//Delete

router.delete("/:id", [verifyAcc, obtainUser], async (req, res) => {
  try {
    await res.user.remove();
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.pass,
      },
    });
    let mailOptions = {
      from: process.env.email,
      to: res.user.email,
      subject: `Leaving so soon, ${res.user.username}?`,
   
    };
    transporter.sendMail(mailOptions, function (err, success) {
      if (error) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(200).send({ message: "Email was sent successfully." });
      }
    });
    res.status(200).send({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
