if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Park = require("./models/park");
const Review = require("./models/review");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const morgan = require("morgan");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const Joi = require("joi");
const { parkSchema, reviewSchema } = require("./joiValidations");

//== Express Router routes variable declaration ==//
const parksRoutes = require("./routes/parks");

// env variables
const PORT = process.env.PORT || 3001;
const IP = process.env.IP;

// set view engine & settings
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "public")));

// console logger for dev env
app.use(morgan("dev"));

// mongoose settings and connection
mongoose.connect("mongodb://localhost:27017/calparks2", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to local Database");
});

// joi validations
const validatePark = (req, res, next) => {
  const { error } = parkSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((element) => element.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((element) => element.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//=== routes ===//

app.use("/parks", parksRoutes);

// home page
app.get("/", (req, res) => {
  res.render("home");
});

// about page
app.get("/about", (req, res) => {
  res.render("about");
});

app.post(
  "/parks/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const park = await Park.findById(req.params.id);
    const review = new Review(req.body.review);
    park.reviews.push(review);
    await review.save();
    await park.save();
    res.redirect(`/parks/${park._id}`);
  })
);

app.delete(
  "/parks/:id/reviews/:reviewId",
  validateReview,
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    //remove reference of review from park, then delete the review itself
    await Park.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/parks/${id}`);
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
