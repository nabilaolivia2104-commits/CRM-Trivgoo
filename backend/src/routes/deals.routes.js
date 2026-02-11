const express = require("express");
const router = express.Router();
const dealController = require("../controllers/deals.controller");

router.post("/deal", dealController.createDeal);
router.get("/deal", dealController.getDeals);
router.get("/deal/:id", dealController.getDealById);
router.put("/deal/:id", dealController.updateDeal);
router.delete("/deal/:id", dealController.deleteDeal);

module.exports = router;
