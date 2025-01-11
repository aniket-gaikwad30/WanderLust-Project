const express = require("express");
const app = express();
const mongoose = require("mongoose");

const MONGU_URL = "mongodb://127.0.0.1:27017/WanderLust";
const Listing = require("./Models/listing.js");
const path = require("path");
const methodOverride = require("method-override");



main()
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  mongoose.connect(MONGU_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


app.get("/", (req, res) => {
  res.send("Responce");
});

// app.get("/testListing",async (req, res) => {
//   let sampleListing = new Listing({
//     title: "This is a title",
//     description: "This is a description ",
//     price: 5666,
//     location: "Nanded",
//     country: "INDIA",
//   });
//   await sampleListing.save();
//   console.log("Saved data");
//   res.send("Success");
// });

//Index Route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

//New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//Show Route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

//Create Route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

app.listen("8080", (req, res) => {
  console.log("App is listining");
});
