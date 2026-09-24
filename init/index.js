require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const MONGO_URL = process.env.ATLASDB_URL;
const mapToken = process.env.MAP_TOKEN;

if (!mapToken) {
  throw new Error("MAP_TOKEN is missing in .env file");
}

const geocodingClient = mbxGeocoding({
  accessToken: mapToken,
});

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    await initDB();

    await mongoose.connection.close();
    console.log("Database connection closed");
  } catch (err) {
    console.error("Database initialization failed:", err);
    process.exit(1);
  }
}

const initDB = async () => {
  // Delete old listings
  await Listing.deleteMany({});
  console.log("Old listings deleted");

  // Create geometry for every sample listing
  const listings = [];

  for (const obj of initData.data) {
    const response = await geocodingClient
      .forwardGeocode({
        query: `${obj.location}, ${obj.country}`,
        limit: 1,
      })
      .send();

    if (!response.body.features.length) {
      console.log(`Location not found: ${obj.location}`);
      continue;
    }

    const geometry = response.body.features[0].geometry;

    listings.push({
      ...obj,
      owner: "6ab2a94e046262ab12dc8f55",
      geometry: geometry,
    });

    console.log(
      `${obj.location} => ${geometry.coordinates}`
    );
  }

  await Listing.insertMany(listings);

  console.log(`${listings.length} listings initialized successfully`);
};

main();