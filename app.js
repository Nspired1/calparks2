if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Park = require("./models/park");
const methodOverride = require("method-override");
const morgan = require("morgan");

// env variables
const PORT = process.env.PORT || 3001;
const IP = process.env.IP;

// set view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// console logger for dev env
app.use(morgan("dev"));

// mongoose settings and connection
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

// routes

// home page
app.get("/", (req, res) => {
  res.render("home");
});

// GET all parks
app.get("/parks", async (req, res) => {
  const parks = await Park.find({});
  res.render("parks/index", { parks });
});

//=== Make a NEW park ====//
// GET form to make a new park
app.get("/parks/new", (req, res) => {
  res.render("parks/new");
});

// POST req to make a new park
app.post("/parks", async (req, res) => {
  const park = new Park(req.body.park);
  await park.save();
  res.redirect(`/parks/${park._id}`);
});

//=== GET one park, SHOW ===//
app.get("/parks/:id", async (req, res) => {
  const park = await Park.findById(req.params.id);
  res.render("parks/show", { park });
});

//====  EDIT PARK =====//
// GET form for EDIT
app.get("/parks/:id/edit", async (req, res) => {
  const park = await Park.findById(req.params.id);
  res.render("parks/edit", { park });
});

//
app.put("/parks/:id", async (req, res) => {
  const { id } = req.params;
  const park = await Park.findByIdAndUpdate(id, { ...req.body.park });
  res.redirect(`/parks/${park._id}`);
});

// DELETE park
app.delete("/parks/:id", async (req, res) => {
  console.log("This is the req.params for delete park route");
  console.log(`This is req.params: ${req.params}`);
  console.log(req.params);
  const { id } = req.params;
  await Park.findByIdAndDelete(id);
  res.redirect("/parks");
});

// to start app at command line type 'node app.js' or 'nodemon app.js' and press <ENTER>
app.listen(PORT, () => {
  console.log(`App running and listening on PORT: ${PORT} and IP: ${IP}`);
});
