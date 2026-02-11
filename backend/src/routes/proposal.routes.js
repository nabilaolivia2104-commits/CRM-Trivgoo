const express = require("express");
const router = express.Router();
const proposalController = require("../controllers/proposal.controller");

router.get("/proposal", proposalController.getAllProposal);
router.post("/proposal", proposalController.createProposal);
router.get("/proposal/need", proposalController.getAllNeed);
router.get("/proposal/:id", proposalController.getProposalById);
router.post("/proposal/", proposalController.createProposal);
router.put("/proposal/:id", proposalController.updateProposal);
router.delete("/proposal/:id", proposalController.deleteProposal);

module.exports = router;
