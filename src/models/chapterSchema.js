const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  isFree: {
    type: Boolean,
    default: false
  },

  video: {
    fileId: {
      type: String,   
      trim: true
    },
    duration: Number,
    thumbnail: String 
  },

  attachments: [
    {
      fileId: String, 
      url: String,     
      name: String,
      size: Number
    }
  ],

  order: {
    type: Number,
    default: 0
  }

});


const ChapterSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  isPaid: {
    type: Boolean,
    default: true
  },

  topics: {
    type: [TopicSchema],
    default: []
  }

}, { timestamps: true });

module.exports = mongoose.model("Chapter", ChapterSchema);
