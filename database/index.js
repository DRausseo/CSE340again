/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const env = require("dotenv").config();
const app = express();
const staticRoutes = require("./routes/static");
const baseController = require('./controllers/baseController');
const pool = require("./database/index"); // Importa el pool de conexiones

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout") // not at views root
app.set('views', path.join(__dirname, 'views'));

/* ***********************
 * Static Files
 *************************/
app.use(express.static(path.join(__dirname, 'public')));

/* ***********************
 * Routes
 *************************/
app.use(staticRoutes); // Use the variable that holds the static routes
app.get("/", baseController.buildHome);

/* ***********************
 * Prueba de conexión a la base de datos
 *************************/
(async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to the database");
    client.release();
  } catch (err) {
    console.error("Failed to connect to the database", err);
  }
})();

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
