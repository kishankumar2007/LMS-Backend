const Chapter = require("../models/chapterSchema.js");
const { uploadOnCloudinary, deleteFromCloudinary } = require("../utils/cloudinary.js");
const { deleteChapterById } = require("../utils/constant.js");


const addChapter = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, isPaid } = req.body;

        if (!title?.trim() || !description?.trim()) {
            return res.status(400).json({
                message: "Title and description are required",
            });
        }

        const videoFiles = req.files?.video || [];
        const attachmentFiles = req.files?.attachments || [];

        const videos = [];
        const attachments = [];


        for (const file of videoFiles) {
            const uploaded = await uploadOnCloudinary(file.path, "video");
            videos.push({
                url: uploaded.url,
                fileId: uploaded.fileId,
            });
        }

        for (const file of attachmentFiles) {
            const uploaded = await uploadOnCloudinary(file.path, "raw");
            attachments.push({
                url: uploaded.url,
                fileId: uploaded.fileId,
            });
        }

        const chapter = await Chapter.create({
            title,
            description,
            isPaid,
            courseId,
            videos,
            attachments,
        });

        return res.status(201).json({
            message: "Chapter created successfully",
            chapter,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


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
};
