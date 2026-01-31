const Chapter = require("../models/chapterSchema.js")
const { delateFromCloudinary } = require("./cloudinary.js");

const DBNAME = "LMS"

const deleteChapterById = async (chapterId) => {

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) {
        throw new Error("Chapter not found");
    }

    const { topics } = chapter

    for (const topic of topics) {
        await delateFromCloudinary(topic.video.fileId);

        for (const attachment of topic.attachments) {
            await delateFromCloudinary(attachment.fileId);
        }
    }
    await Chapter.findByIdAndDelete(chapterId);

    return true;
};

module.exports = { DBNAME, deleteChapterById }