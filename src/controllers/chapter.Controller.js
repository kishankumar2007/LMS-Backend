const Chapter = require("../models/chapterSchema.js");
const Course = require("../models/courseSchema.js");
const {generateStreamingUrl, delateFromCloudinary } = require("../utils/cloudinary.js");


const addChapter = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, isPaid, topics } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Invalid courseId" });
    }

    if (!title?.trim()) {
      return res.status(400).json({ message: "Chapter title is required" });
    }

    if (typeof isPaid !== "boolean") {
      return res.status(400).json({ message: "isPaid must be boolean" });
    }

    if (!Array.isArray(topics) || topics.length === 0) {
      return res.status(400).json({ message: "At least one topic is required" });
    }

    for (const topic of topics) {
      if (!topic.title?.trim()) {
        return res.status(400).json({ message: "Topic title is required" });
      }

      if (topic.video?.fileId && typeof topic.video.fileId !== "string") {
        return res.status(400).json({
          message: "Invalid video fileId"
        });
      }
    }

    const chapter = await Chapter.create({
      courseId,
      title: title.trim(),
      description,
      isPaid,
      topics
    });

    return res.status(201).json({
      message: "Chapter added successfully",
      chapter
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



const allChapters = async (req, res) => {
    try {
        const { courseId } = req.params
        console.log(courseId)
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


    const { title, description, isPaid, topics } = req.body;

    if (title !== undefined) chapter.title = title;
    if (description !== undefined) chapter.description = description;
    if (isPaid !== undefined) chapter.isPaid = isPaid;

    if (Array.isArray(topics)) {
      chapter.topics = topics.map((topic, index) => ({
        title: topic.title,
        isFree: topic.isFree,
        video: {
          fileId: topic.video?.fileId || "",
        },
        attachments: topic.attachments || [],
      }));
    }

    await chapter.save();

    return res.status(200).json({
      message: "Chapter updated successfully",
      chapter,
    });

  } catch (error) {
    console.error("Edit chapter error:", error);
    return res.status(500).json({
      message: "Failed to update chapter",
    });
  }
};




const deleteChapter = async (req, res) => {
  try {
    const { chapterId } = req.params;

    if (!chapterId) {
      return res.status(400).json({
        message: "chapterId is required"
      });
    }

    const chapter = await Chapter.findById(chapterId);

    if (!chapter) {
      return res.status(404).json({
        message: "Chapter not found"
      });
    }

    for (const topic of chapter.topics) {
      if (topic.video?.fileId) {
        await delateFromCloudinary(topic.video.fileId);
      }

      if (topic.attachments?.length) {
        for (const file of topic.attachments) {
          if (file.fileId) {
            await delateFromCloudinary(file.fileId);
          }
        }
      }
    }

    await Chapter.findByIdAndDelete(chapterId);

    return res.status(200).json({
      message: "Chapter deleted successfully"
    });

  } catch (error) {
    console.error("Delete chapter error:", error);
    return res.status(500).json({
      message: "Failed to delete chapter"
    });
  }
};

const getStreamUrl = async (req, res) => {
  try {
    const { fileId } = req.params;

    const streamUrl = generateStreamingUrl(fileId);

    return res.status(200).json({ streamUrl });

  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


module.exports = {
    addChapter,
    editChapter,
    deleteChapter,
    allChapters,
    getStreamUrl
};
