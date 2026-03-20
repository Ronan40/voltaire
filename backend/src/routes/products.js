const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");
const auth = require("../middleware/auth");

router.get("/", auth, controller.getProducts);
router.get("/:id", auth, controller.getProduct);
router.post("/", auth, controller.createProduct);
router.put("/:id", auth, controller.updateProduct);
router.delete("/:id", auth, controller.deleteProduct);

module.exports = router;