const Chapter = require("../models/chapterSchema.js");
const Course = require("../models/courseSchema.js");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/cloudinary.js");
const { deleteChapterById } = require("../utils/constant.js");


const addChapter = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, isPaid, topics } = req.body;

        const course = await Course.findById({ _id: courseId })

        if (!course) return res.status(404).json({ message: "invalid courseId" })

        if ([title, description, isPaid].some(field => field.trim === "")) {
            return res.status(400).json({ message: "all fields are requried" })
        }

        for (const topic of topics) {
            if (!topic.title?.trim()) {
                return res.status(400).json({
                    message: "Invalid topic format"
                })
            }
        }

        const chapter = await Chapter.create({ courseId, title, description, isPaid, topics })

        if (chapter) {
            res.status(200).json({ message: "Chapter added", chapter })
        } else {
            throw Error("Failed to create chapter")
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const allChapters = async (req, res) => {
    try {
        const { courseId } = req.params

        const chapters = await Chapter.find({ courseId })

        if (chapters.length === 0) {
            return res.status(200).json({ chapters: [] })
        }

        res.status(200).json({ chapters })

    } catch (error) {
        res.status(400).json({ message: "Failed to load chapters", error: error.message })
    }
}

const editChapter = async (req, res) => {
    try {
        const { chapterId } = req.params;
        const chapter = await Chapter.findById(chapterId);

        if (!chapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }

        const allowedFields = ["title", "description", "isPaid"];
        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                chapter[field] = req.body[field];
            }
        });

        const videoFiles = req.files?.video || [];
        const attachmentFiles = req.files?.attachments || [];

        for (const file of videoFiles) {
            const uploaded = await uploadOnCloudinary(file.path, "video");
            chapter.videos.push({
                url: uploaded.url,
                fileId: uploaded.fileId,
            });
        }

        for (const file of attachmentFiles) {
            const uploaded = await uploadOnCloudinary(file.path, "raw");
            chapter.attachments.push({
                url: uploaded.url,
                fileId: uploaded.fileId,
            });
        }

        await chapter.save();

        res.status(200).json({
            message: "Chapter updated successfully",
            chapter,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteChapterFiles = async (req, res) => {
    try {
        const { chapterId, fileId } = req.params;
        const chapter = await Chapter.findById(chapterId);

        if (!chapter) {
            return res.status(404).json({ message: "Chapter not found" });
        }

        const video = chapter.videos.find((v) => v.fileId === fileId);
        const attachment = chapter.attachments.find((a) => a.fileId === fileId);

        if (video) {
            await deleteFromCloudinary(video.fileId, "video");
            chapter.videos = chapter.videos.filter((v) => v.fileId !== fileId);
        }

        if (attachment) {
            await deleteFromCloudinary(attachment.fileId, "raw");
            chapter.attachments = chapter.attachments.filter(
                (a) => a.fileId !== fileId
            );
        }

        await chapter.save();

        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete file",
            error: error.message,
        });
    }
};


const deleteChapter = async (req, res) => {
    try {
        const { chapterId } = req.params;

        await deleteChapterById(chapterId);

        res.status(200).json({
            message: "Chapter deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addChapter,
    editChapter,
    deleteChapterFiles,
    deleteChapter,
    allChapters
};
