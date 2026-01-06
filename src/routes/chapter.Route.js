const express = require("express")
const { userAuth } = require("../middlewares/authMiddleware")
const { addChapter, deleteChapterFiles, editChapter, deleteChapter, allChapters,getStreamUrl } = require("../controllers/chapter.Controller");
const upload = require("../middlewares/multer.Middleware");

const router = express.Router()


router.post("/course/:courseId/chapter/create", userAuth,addChapter)

router.patch("/course/chapter/:chapterId", userAuth, editChapter)


router.get("/course/:courseId/chapters", userAuth, allChapters)


router.post("/course/:chapterId/delete", userAuth, deleteChapter)

router.get("/streaming-url/:fileId", getStreamUrl);


module.exports = router