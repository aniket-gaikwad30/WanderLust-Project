const express = require("express");
const app = express();
const mongoose = require("mongoose");

const MONGU_URL = "mongodb://127.0.0.1:27017/WanderLust";
const Listing = require("./Models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.use(express.static(path.join(__dirname, "/public")));
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const reviews = require("./Models/review.js");
const listings = require("./routes/listings.js");
const review = require("./routes/review.js");


main()
  .then(() => {
    console.log("connected to DB");
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
app.engine("ejs", ejsMate);

app.get("/", (req, res) => {
  res.send("Responce");
});

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};



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

app.use("/listings", listings);

//reviews
app.use("/listings/:id/reviews", review);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
  // res.status(statusCode).send(message);
  // res.send("Something went wrong !");
});

app.listen("8080", (req, res) => {
  console.log("App is listining");
});
