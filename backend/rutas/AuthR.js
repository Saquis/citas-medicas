const express = require("express");
const router = express.Router();
const { login } = require("../controladores/AuthC");

router.post("/", login);

module.exports = router;
