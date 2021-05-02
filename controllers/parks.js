const Park = require("../models/park");

module.exports.index = async (req, res) => {
  const parks = await Park.find({});
  res.render("parks/index", { parks });
};

module.exports.renderNewForm = (req, res) => {
  res.render("parks/new");
};

module.exports.createPark = async (req, res) => {
  const park = new Park(req.body.park);
  await park.save();
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
