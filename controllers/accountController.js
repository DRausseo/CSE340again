const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Function to build the login view
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

// Function to build the registration view
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

// Function to process registration
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    return res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you are registered ${account_firstname}. Please log in.`
    );
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    return res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  }
}

// Function to process login
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.SESSION_SECRET, {
        expiresIn: 3600,
      });
      res.cookie("token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600 * 1000,
      });
      return res.redirect("/account");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    req.flash("error", "Login failed.");
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
  }
}

// Function to build the account management view
async function buildAccManager(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/account-manager", {
    title: "Account Manager",
    nav,
    errors: null,
  });
}

// Function to deliver the update account view
async function getUpdateAccountView(req, res) {
  const account_id = parseInt(req.params.account_id);
  const client = await accountModel.getAccountById(account_id);
  res.render("account/update-account", { title: "Update Account", client });
}

// Function to handle the account update
async function updateAccount(req, res) {
  const { account_id, firstname, lastname, email } = req.body;
  const result = await accountModel.updateAccount(
    account_id,
    firstname,
    lastname,
    email
  );
  if (result) {
    req.flash("success", "Account updated successfully.");
    res.redirect("/account");
  } else {
    req.flash("error", "Failed to update account.");
    res.redirect(`/account/update/${account_id}`);
  }
}

// Function to handle the password change
async function changePassword(req, res) {
  const { account_id, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await accountModel.updatePassword(account_id, hashedPassword);
  if (result) {
    req.flash("success", "Password changed successfully.");
    res.redirect("/account");
  } else {
    req.flash("error", "Failed to change password.");
    res.redirect(`/account/update/${account_id}`);
  }
}

module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  accountLogin,
  buildAccManager,
  getUpdateAccountView,
  updateAccount,
  changePassword,
};
