const express = require('express');
const { userAuth } = require("../middlewares/authMiddleware")
const { editProfile, myCourses } = require("../controllers/user.Controller");
const upload = require('../middlewares/multer.Middleware');

const router = express.Router()


router.get("/mycourses",userAuth,myCourses)

router.patch("/profile/edit", userAuth, upload.fields([
    {
        name: "avatar",
        maxCount: 1
    }
]), editProfile)



module.exports = router