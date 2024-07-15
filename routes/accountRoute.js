const express = require("express");
const router = new express.Router();
const util = require("../utilities/index");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

router.get("/login", accountController.buildLogin);
router.get("/register", accountController.buildRegister);
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  accountController.registerAccount // Asegúrate de usar el nombre correcto de la función
);

router.post("/login", accountController.accountLogin);

module.exports = router;
