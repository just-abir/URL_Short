const express = require("express");
const { createLink, qrCodeDownlad } = require("../controller/link.controller");

const router = express.Router();

router.post("/", createLink);
router.get("/:code/download", qrCodeDownlad);

module.exports = router;
