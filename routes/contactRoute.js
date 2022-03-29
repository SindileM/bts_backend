const router = require("express").Router();
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
  let { email, name, message } = req.body;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.email,
      pass: process.env.pass,
    },
  });

  let mailOptions = {
    from: process.env.email,
    to: process.env.email,
    subject: `${name} has sent you a message!`,
    html: `
        <h1>Here's what they had to say...</h1>
        <p>${message}</p>

        <h4>Email them back using the following ${email}</h4>
      `,
  };
  try {
    transporter.sendMail(mailOptions, function (error, data) {
      if (error) {
        res.status(400).send({ message: "Email could not be sent." });
      } else {
        res.status(200).send( { message: "Email sent successfully." });
      }
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
