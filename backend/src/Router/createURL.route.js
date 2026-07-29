const express = require("express");
const { createLink } = require("../controller/link.controller");

const router = express.Router();

router.post("/", createLink);

module.exports = router;
