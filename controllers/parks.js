const Park = require("../models/park");
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const parks = await Park.find({});
  res.render("parks/index", { parks });
};

module.exports.renderNewForm = (req, res) => {
  res.render("parks/new");
};

module.exports.createPark = async (req, res, next) => {
  const park = new Park(req.body.park);
  console.log("This is in the createPark Controller");
  console.log(req.body.park);
  park.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  await park.save();
  console.log("This is createPark controller");
  console.log(park);
  res.redirect(`/parks/${park._id}`);
};

module.exports.showPark = async (req, res) => {
  const park = await Park.findById(req.params.id);
  res.render("parks/show", { park });
};

module.exports.renderEditForm = async (req, res) => {
  const park = await Park.findById(req.params.id);
  res.render("parks/edit", { park });
};

module.exports.editPark = async (req, res) => {
  const { id } = req.params;
  const park = await Park.findByIdAndUpdate(id, { ...req.body.park });
  res.redirect(`/parks/${park._id}`);
};

module.exports.deletePark = async (req, res) => {
  console.log("This is the req.params for delete park route");
  console.log(`This is req.params: ${req.params}`);
  console.log(req.params);
  const { id } = req.params;
  await Park.findByIdAndDelete(id);
  res.redirect("/parks");
};
