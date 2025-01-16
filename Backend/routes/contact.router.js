const express = require("express");
const router = express.Router();
const { contactUsController } = require("../controllers/contact.controller");

router.post("/submitForm", contactUsController);

module.exports = router;
