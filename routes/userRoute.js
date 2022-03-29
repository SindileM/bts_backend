const dotenv = require("dotenv");
dotenv.config();
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/userModel");
const verify = require("../middleware/verify");
const { retrieveUser } = require("../middleware/retriever.js");
const verifyAcc = require("../middleware/authJWT");
const nodemailer = require("nodemailer");

//Register

router.post("/signup", verify, async (req, res) => {
  try {
    const passEncryption = bcrypt.hashSync(req.body.password, 8);
    const newUser = new user({
      username: req.body.username,
      email: req.body.email,
      password: passEncryption,
    });
    await newUser.save();
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.email,
        pass: process.env.pass,
      },
    });
    let mailOptions = {
      from: process.env.email,
      to: req.body.email,
      subject: `Welcome to The Army Blog, ${req.body.username}!`,
      html: `
        <h2>Hi current and future ARMY it's Sindile Here!.</h2>
        <h3>Thank you for signing up to my blog site!</h3>
        <h3>This blog is for a band that we know and love. BANGTAN SONYEONDAN commonly known as BTS.</h3>
        <h4>Just as they spread the message of self love and acceptance so should we.</h4>

        <h4>Happy blogging, ${req.body.username}</h4>

        <h6>Note: Do not reply to this email.</h6>
 
        <h6>The Army Blog.</h6>
      `,
    };
    transporter.sendMail(mailOptions, function (err, success) {
      if (error) {
        res.status(400).send({ message: err.message });
      } else {
        res.status(200).send({ message: "Email was sent successfully." });
      }
    });
    res.status(200).send({ message: "Successfully created new user" });
  } catch (error) {
    res.status(500).send({ message: "Error creating new user" });
  }
});

//Login

router.post("/signin", async (req, res) => {
  try {
    const verifyEmail = user.findOne({ email: req.body.email }, (err, user) => {
      if (!verifyEmail) return res.status(401).send({ message: err.message });
      if (!user) return res.sendStatus(404);
      const passMatch = bcrypt.compareSync(req.body.password, user.password);
      if (!passMatch) return res.sendStatus(404);
      const authToken = jwt.sign({ _id: user._id }, process.env.access);
      if (!authToken) return res.sendStatus(401);
      res.header("auth-token", authToken).send({
        _id: user._id,
        username: user.username,
        email: user.email,
        access: authToken,
        profile: user.profile,
      });
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

//Update

router.put("/:id", [verifyAcc, retrieveUser], async (req, res) => {
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
      // html: `
      //   <h2>Hello there, ${res.user.username}</h2>
      //   <h3>It's Nadeem from The Mental Mind. I've noticed that you have updated your profile.</h3>
      //   <h3>Because your credentials have changed, the blog is setup to sign you out immediately as your previous credentials are no longer valid.</h3>
      //   <h3>This is to protect your personal information and keep the site safe.</h3>

      //   <h3>To access the website, just sign in with your new credentials.</h3>

      //   <h4>Happy blogging, ${res.user.username}</h4>

      //   <h6>Note: Do not reply to this email.</h6>

      //   <h6>The Mental Mind.</h6>
      // `,
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

router.delete("/:id", [verifyAcc, retrieveUser], async (req, res) => {
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
      // html: `
      //   <h2>Hello there, ${res.user.username}</h2>
      //   <h3>It's Nadeem from The Mental Mind. Looks like you've decided to delete your profile.</h3>
      //   <h3>I really hate to see you leave but I understand that eventually all good things do come to an end.</h3>
      //   <h3>It has really been fun having you blog and share your knowledge with The Mental Mind.</h3>

      //   <h3>I wish you nothing but prosperity and happiness moving forward, ${res.user.username}.</h3>

      //   <h4>Thank you for blogging with The Mental Mind.</h4>

      //   <h6>Note: Do not reply to this email.</h6>

      //   <h6>Army Blog</h6>
      // `,
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
