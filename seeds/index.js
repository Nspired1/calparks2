//self contained seeds file that will erase and repopulate database with parks

const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Park = require("../models/park");
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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  //delete everything in database
  await Park.deleteMany({});
  //loop over
  for (let i = 0; i < 25; i++) {
    const random25 = Math.floor(Math.random() * 25);
    const park = new Park({
      location: `${cities[random25].city}, ${cities[random25].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
    });
    await park.save();
  }
};

// invoking the function that will actually seed the database
seedDB();
