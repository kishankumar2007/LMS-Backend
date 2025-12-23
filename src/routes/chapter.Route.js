const express = require("express")
const { userAuth } = require("../middlewares/authMiddleware")
const { addChapter, deleteChapterFiles, editChapter, deleteChapter, allChapters } = require("../controllers/chapter.Controller");
const upload = require("../middlewares/multer.Middleware");

const router = express.Router()


router.post("/course/:courseId/chapter/create", userAuth,
    upload.fields([
        {
            name: "video",
            maxCount: 8
        },
        {
            name: "attachments",
            maxCount: 8
        }

    ]),

    addChapter)

router.patch("/course/chapter/:chapterId/edit", userAuth,
    upload.fields([
        {
            name: "video",
            maxCount: 8
        },
        {
            name: "attachments",
            maxCount: 8
        }

    ]), editChapter)


router.get("/course/:courseId/chapters", userAuth, allChapters)

router.post("/course/chapter/:chapterId/:fileId/delete", userAuth, deleteChapterFiles)

router.post("/course/:chapterId/delete", userAuth, deleteChapter)

module.exports = router