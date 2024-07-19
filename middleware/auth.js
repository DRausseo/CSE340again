const jwt = require("jsonwebtoken");
require("dotenv").config(); // Cargar variables de entorno desde el archivo .env
const secret = process.env.SESSION_SECRET; // Cargar la clave secreta desde las variables de entorno

function checkAuth(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    req.flash("error", "Please log in to access this page.");
    return res.redirect("/account/login");
  }

  try {
    const decoded = jwt.verify(token, secret);
    if (
      decoded.account_type !== "Employee" &&
      decoded.account_type !== "Admin"
    ) {
      req.flash("error", "Access denied.");
      return res.redirect("/account/login");
    }
    res.locals.clientName = decoded.firstname;
    res.locals.loggedIn = true;
    next();
  } catch (err) {
    req.flash("error", "Please log in to access this page.");
    res.redirect("/account/login");
  }
}

module.exports = checkAuth;
