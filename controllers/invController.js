const invModel = require("../models/inventory-model");
const commentModel = require("../models/comment-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );
    if (!data.length) {
      return res.status(404).send("No data found for this classification ID");
    }
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const inv_id = req.params.inventoryId;
    const data = await invModel.getInventoryByInventoryId(inv_id);
    const comments = await commentModel.getCommentsByVehicleId(inv_id); // Obtener comentarios

    if (!data) {
      return res.status(404).send("No data found for this inventory ID");
    }

    let nav = await utilities.getNav();
    res.render("./inventory/detail", {
      title: `${data.inv_year} ${data.inv_make} ${data.inv_model}`,
      nav,
      vehicle: data,
      comments, // Pasar comentarios a la vista
      user_id: req.user ? req.user.account_id : null, // Asegurarse de pasar user_id si el usuario está autenticado
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build inventory manager view
 * ************************** */
invCont.buildManager = async function (req, res, next) {
  let nav = await utilities.getNav();
  req.flash("notice", "This is a message.");
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Management",
    nav,
    classificationSelect,
  });
};

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Add new classification
 * ************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  const addResult = await invModel.addClassification(classification_name);
  if (addResult) {
    req.flash("notice", "Classification added successfully.");
    res.redirect("/inv");
  } else {
    req.flash("notice", "Sorry, the classification was not added.");
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  }
};

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  req.flash("notice", "This is a message.");
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
  });
};

/* ***************************
 *  Add new inventory
 * ************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const addResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );
  let classificationList = await utilities.buildClassificationList();
  if (addResult) {
    req.flash("notice", "Inventory added successfully.");
    res.redirect("/inv");
  } else {
    req.flash("notice", "Sorry, the inventory was not added.");
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByInventoryId(inv_id);
  const classificationSelect = await utilities.buildClassificationList(
    itemData.classification_id
  );
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;
  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.getDeleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  try {
    let nav = await utilities.getNav();
    const itemData = await invModel.getInventoryByInventoryId(inv_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inventory: itemData,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id);
  try {
    const deleteResult = await invModel.deleteInventoryItem(inv_id);
    if (deleteResult.rowCount > 0) {
      req.flash("notice", "Item deleted successfully.");
      res.redirect("/inventory/management");
    } else {
      req.flash("notice", "Failed to delete item.");
      res.redirect(`/inventory/delete/${inv_id}`);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
