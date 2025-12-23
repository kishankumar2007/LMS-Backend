const cloudinary = require("cloudinary").v2
const fs = require("node:fs")
require('dotenv').config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
})

const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
  try {
    const res = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType,
    });

    if (!res.secure_url) {
      throw new Error("Cloudinary upload failed");
    }

    fs.unlinkSync(localFilePath);

    return {
      url: res.secure_url,
      fileId: res.public_id,
      resourceType: res.resource_type,
    };
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    throw error.message;
  }
};


const delateFromCloudinary = async (publicId) => {
  const types = ["image", "video", "raw"];
  try {
    for (const type of types) {
      const res = await cloudinary.uploader.destroy(publicId, { resource_type: type })

      if (res.result === 'ok') {
        return res
      }
    }
  } catch (error) {
    console.log(error.message)
  }
}


module.exports = { uploadOnCloudinary, delateFromCloudinary }