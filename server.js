/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities/index");

/* ***********************
 * View Engine And Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Serve Static Files
 *************************/
app.use(express.static(path.join(__dirname, "public")));

/* ***********************
 * Routes
 *************************/
app.use(static);

// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use("/inv", inventoryRoute);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Middleware to catch and handle errors
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  if (err.status == 404) {
    res.status(404).render("errors/error", {
      title: "404 Error",
      message: "Sorry, we appear to have lost that page.",
      nav,
    });
  } else {
    res.status(500).render("errors/error", {
      title: "500 Error",
      message: "Oh no! There was a crash. Maybe try a different route?",
      nav,
    });
  }
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
