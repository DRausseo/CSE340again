const express = require("express");
const path = require("path");
const router = express.Router(); // Usa Router con mayúscula

// Static Routes
// Set up "public" folder / subfolders for static files
router.use(express.static("public"));
router.use("/css", express.static(path.join(__dirname, "../public/css")));
router.use("/js", express.static(path.join(__dirname, "../public/js")));
router.use("/images", express.static(path.join(__dirname, "../public/images")));

// Ruta de ejemplo
router.get('/', (req, res) => {
  res.send('Static content');
});

module.exports = router;
