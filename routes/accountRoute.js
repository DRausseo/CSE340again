const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

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

module.exports = router;
