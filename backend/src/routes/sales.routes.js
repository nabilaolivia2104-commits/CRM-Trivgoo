const express = require("express");
const router = express.Router();
const salesController = require("../controllers/sales.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.use(verifyToken);

router.get("/sales", salesController.getAccountByRole);
router.get("/sales/:id", salesController.getSalesById);
router.post("/sales", salesController.addSales);
router.put("/sales/:id", salesController.updateSales);
router.delete("/sales/:id", salesController.deleteSales);
module.exports = router;
