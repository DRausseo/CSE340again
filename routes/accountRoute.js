const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/index");
const checkAuth = require("../middleware/auth");

// Rutas para la cuenta
router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);
router.post(
  "/register",
  utilities.handleErrors(accountController.registerAccount)
);
router.post("/login", utilities.handleErrors(accountController.accountLogin));
router.get("/logout", accountController.logout);
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccManager)
);

// Rutas para actualizar cuenta
router.get(
  "/update/:account_id",
  checkAuth,
  utilities.handleErrors(accountController.getUpdateAccountView)
);
router.post(
  "/update",
  checkAuth,
  utilities.handleErrors(accountController.updateAccount)
);
router.post(
  "/change-password",
  checkAuth,
  utilities.handleErrors(accountController.changePassword)
);

module.exports = router;
