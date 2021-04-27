if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Park = require("./models/park");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const morgan = require("morgan");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
// env variables
const PORT = process.env.PORT || 3001;
const IP = process.env.IP;

// set view engine & settings
app.engine("ejs", ejsMate);
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

//=== routes ===//

// home page
app.get("/", (req, res) => {
  res.render("home");
});

// GET all parks
app.get(
  "/parks",
  catchAsync(async (req, res) => {
    const parks = await Park.find({});
    res.render("parks/index", { parks });
  })
);

//=== Make a NEW park ====//
// GET form to make a new park
app.get("/parks/new", (req, res) => {
  res.render("parks/new");
});

// POST req to make a NEW park
app.post(
  "/parks",
  catchAsync(async (req, res) => {
    if (!req.body.park) throw new ExpressError("Invalid Park Data", 400);
    const park = new Park(req.body.park);
    await park.save();
    res.redirect(`/parks/${park._id}`);
  })
);

//=== GET one park, SHOW ===//
app.get(
  "/parks/:id",
  catchAsync(async (req, res) => {
    const park = await Park.findById(req.params.id);
    res.render("parks/show", { park });
  })
);

//====  EDIT PARK =====//
// GET form for EDIT
app.get(
  "/parks/:id/edit",
  catchAsync(async (req, res) => {
    const park = await Park.findById(req.params.id);
    res.render("parks/edit", { park });
  })
);

// PUT req to EDIT a park
app.put(
  "/parks/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const park = await Park.findByIdAndUpdate(id, { ...req.body.park });
    res.redirect(`/parks/${park._id}`);
  })
);

// DELETE park
app.delete(
  "/parks/:id",
  catchAsync(async (req, res) => {
    console.log("This is the req.params for delete park route");
    console.log(`This is req.params: ${req.params}`);
    console.log(req.params);
    const { id } = req.params;
    await Park.findByIdAndDelete(id);
    res.redirect("/parks");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh, no! Something went wrong.";
  res.status(statusCode).render("error", { err });
  res.send("Something went wrong, please try again later");
});

// to start app at command line type 'node app.js' or 'nodemon app.js' and press <ENTER>
app.listen(PORT, () => {
  console.log(`App running and listening on PORT: ${PORT} and IP: ${IP}`);
});
