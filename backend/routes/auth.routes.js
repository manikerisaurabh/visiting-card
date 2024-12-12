const express = require("express");
const router = express.Router();
const {
  signUpController,
  signInController,
} = require("../controller/auth.controller.js");
router.post("/sign-up", signUpController);

router.post("/log-in", signInController);

module.exports = router;
