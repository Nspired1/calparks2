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
  for (let i = 0; i < 30; i++) {
    const random30 = Math.floor(Math.random() * 25);
    const park = new Park({
      location: `${cities[random30].city}, ${cities[random30].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Random loran ipsum bacon brussel sprouts pie Captain America, Infinite Frontier, invisible kingdom, far sector cloud city, East of West.",
    });
    await park.save();
  }
};

// invoking the function that will actually seed the database
seedDB().then(() => {
  mongoose.connection.close();
  console.log("Close connection to local database");
});
