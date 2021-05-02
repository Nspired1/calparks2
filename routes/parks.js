const express = require("express");
const router = express.Router();
const Park = require("../models/park");
const parksController = require("../controllers/parks");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const { parkSchema } = require("../joiValidations");
// image upload libraries
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

// joi validations for new and edit
const validatePark = (req, res, next) => {
  const { error } = parkSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((element) => element.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// GET all parks
router.get("/", catchAsync(parksController.index));

//=== Make a NEW park ====//
// GET form to make a new park
router.get("/new", parksController.renderNewForm);

// POST req to make a NEW park
router.post("/", validatePark, catchAsync(parksController.createPark));

//=== GET one park, SHOW ===//
router.get("/:id", catchAsync(parksController.showPark));

//====  EDIT PARK =====//
// GET form for EDIT
router.get("/:id/edit", catchAsync(parksController.renderEditForm));

// PUT req to EDIT a park
router.put("/:id", validatePark, catchAsync(parksController.editPark));

// DELETE park
router.delete("/:id", catchAsync(parksController.deletePark));

module.exports = router;
