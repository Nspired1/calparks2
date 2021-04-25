if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Park = require("./models/park");

mongoose.connect("mongodb://localhost:27017/calparks2", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to local Database");
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const PORT = process.env.PORT || 3001;
const IP = process.env.IP;

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/makepark", async (req, res) => {
  const park = new Park({ title: "My frontyard" });
  await park.save();
  res.send(park);
});

// to start app at command line type 'node app.js' or 'nodemon app.js' and press <ENTER>
app.listen(PORT, () => {
  console.log(`App running and listening on PORT: ${PORT} and IP: ${IP}`);
});
