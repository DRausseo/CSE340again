const express = require("express");
const router = new express.Router();
const util = require("../utilities/index");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);
router.post(
  "/login",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.accountLogin)
);

router.get("/account/", accountController.buildAccManager);

module.exports = router;
