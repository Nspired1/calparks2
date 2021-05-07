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
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

// Mongo middleware to delete reviews when a park is deleted.
// The post isn't a http req, it means AFTER a Mongo doc is deleted. Mongo has pre & post
// findOneAndDelete is triggered by findByIdAndDelete in the controller.
ParkSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Park", ParkSchema);
