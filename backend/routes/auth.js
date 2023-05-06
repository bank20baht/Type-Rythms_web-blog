const express = require("express");
const router = express.Router();
const jwtRefreshTokenValidate = require('../middleware/jwtRefreshTokenValidate')
const { login , refresh, register } = require("../controllers/auth")

router.post("/login", login);
router.post("/register", register)
router.post("/refresh", jwtRefreshTokenValidate, refresh);

module.exports = router;