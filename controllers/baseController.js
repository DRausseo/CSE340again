const utilities = require("../utilities/");
const baseController = {};

baseController.buildHome = async function (req, res) {
  const nav = await utilities.getNav();
  res.render("index", { title: "Home", nav });
};

exports.buildHome = async (req, res) => {
  res.render("index", { title: "Home" });
};

exports.triggerError = (req, res) => {
  throw new Error("Simulated error");
};

module.exports = baseController;
