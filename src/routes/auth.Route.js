const express = require('express');
const { createUser, loginUser, getUserProfile, logout, userInterest } = require("../controllers/auth.Controller")
const { userAuth } = require('../middlewares/authMiddleware')
const router = express.Router()


router.post("/register", createUser)
router.post("/login", loginUser)
router.post("/user/interest", userAuth, userInterest)
router.post("/logout", userAuth, logout)
router.get("/profile", userAuth, getUserProfile)

module.exports = router