const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
const postRoute = require("./routes/postRoute");
const commentRoute = require("./routes/commentRoute");
const contactRoute = require("./routes/contactRoute");
const cors = require("cors");

app.use(cors());
app.use(express.json());

mongoose
.connect(process.env.connection, { 
  suseNewUrlParser: true }, () => {
  console.log("Connected to MongoDB database.");
});

app.use("/users", userRoute);
app.use("/posts", postRoute);
app.use("/posts", commentRoute);
app.use("/contact", contactRoute);

app.get("/", (req, res) => {
  res.send("Rest API for The BTS Army Blog.");
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is active on port ${port}`);
});
