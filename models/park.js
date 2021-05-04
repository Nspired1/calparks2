const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

//virtual schema for image thumbnails to be displayed on SHOW page
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("upload", "upload/w_300");
});

const ParkSchema = new Schema({
  title: String,
  price: String,
  images: [ImageSchema],
  description: String,
  location: String,
});

module.exports = mongoose.model("Park", ParkSchema);
