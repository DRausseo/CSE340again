const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/index");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:inventoryId", invController.buildByInventoryId);
router.get("/management", invController.buildManager);
router.get("/add-inventory", invController.buildAddInventory);
router.post("/add-inventory", invController.addInventory);
router.get("/add-classification", invController.buildAddClassification);
router.post("/add-classification", invController.addClassification);
router.get("/add-vehicle", invController.buildAddInventory);
router.post("/add-vehicle", invController.addInventory);
router.get("/manage-inv", invController.buildManager);
router.get("/json/:classification_id", invController.getInventoryJSON);
router.get(
  "/json/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);
router.get("/edit/:inv_id", invController.editInventoryView);
router.post("/update-inventory", invController.updateInventory);
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

module.exports = router;
