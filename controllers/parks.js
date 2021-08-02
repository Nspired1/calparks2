const Park = require("../models/park");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

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
  res.redirect(`/parks/${park._id}`);
};

module.exports.showPark = async (req, res) => {
  const park = await Park.findById(req.params.id).populate("reviews");
  res.render("parks/show", { park });
};

module.exports.renderEditForm = async (req, res) => {
  const park = await Park.findById(req.params.id);
  res.render("parks/edit", { park });
};

module.exports.editPark = async (req, res) => {
  const { id } = req.params;
  const park = await Park.findByIdAndUpdate(id, { ...req.body.park });
  updatedImages = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  park.images.push(...updatedImages);
  await park.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await park.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  res.redirect(`/parks/${park._id}`);
};

module.exports.deletePark = async (req, res) => {
  const { id } = req.params;
  const park = await Park.findById(id);
  park.images.map((image) => {
    cloudinary.uploader.destroy(image.filename);
  });
  await Park.findByIdAndDelete(id);
  res.redirect("/parks");
};
