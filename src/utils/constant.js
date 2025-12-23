const Chapter = require("../models/chapterSchema.js")
const { delateFromCloudinary } = require("./cloudinary.js");

const DBNAME = "LMS"

const deleteChapterById = async (chapterId) => {

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
        throw new Error("Chapter not found");
    }

    for (const video of chapter.videos) {
        await delateFromCloudinary(video.fileId);
    }

    for (const attachment of chapter.attachments) {
        await delateFromCloudinary(attachment.fileId);
    }

    await Chapter.findByIdAndDelete(chapterId);

    return true;
};

module.exports = { DBNAME, deleteChapterById }