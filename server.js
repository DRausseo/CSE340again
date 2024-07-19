/******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session");
const pool = require("./database/");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config(); // Cargar variables de entorno desde el archivo .env
const app = express();
const staticRoutes = require("./routes/static");
const utilities = require("./utilities");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

/* ***********************
 * Middleware
 ************************/
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

// Express Messages Middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

// Middleware para verificar JWT
app.use(utilities.checkJWTToken);

app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // Ruta de la plantilla de layout

app.use(staticRoutes);

// Routes
// Ruta para la página principal
app.get("/", baseController.buildHome);

// Rutas del inventario
app.use("/inv", inventoryRoute);

// Rutas de la cuenta
app.use("/account", accountRoute);

// Ruta para manejar errores
app.get("/trigger-error", baseController.triggerError);

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).render("error", { error: err, title: "Error" });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
