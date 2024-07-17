const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const checkAuth = require("../middleware/auth");
router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

router.get("/account/", accountController.buildAccManager);

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccManager)
);

// Ruta para mostrar la vista de actualización de cuenta
router.get(
  "/update/:account_id",
  checkAuth,
  accountController.getUpdateAccountView
);

// Ruta para procesar la actualización de la cuenta
router.post("/update", checkAuth, accountController.updateAccount);

// Ruta para procesar el cambio de contraseña
router.post("/change-password", checkAuth, accountController.changePassword);

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
