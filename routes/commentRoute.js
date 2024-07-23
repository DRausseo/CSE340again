const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const utilities = require("../utilities");

router.post(
  "/add",
  utilities.checkJWTToken,
  utilities.handleErrors(commentController.addComment)
);

module.exports = router;
