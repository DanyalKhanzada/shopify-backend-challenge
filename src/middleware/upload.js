const multer = require("multer")
const sharp = require("sharp")

const upload = multer({
  limits: {
    fileSize: 16000000,
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
      return cb(new Error("Please upload an image with extension .jpg, .jpeg, or .png"))
    }
    callback(undefined, true)
  }
})

const createBufferArray = async (files) => {
  try {
    const imageBuffers = await Promise.all(files.map((file) => sharp(file.buffer).resize({
      height: 1080,
      width: 1920
    }).png().toBuffer()))
    return imageBuffers
  } catch (err) {
    return []
  }
}

module.exports = {
  upload,
  createBufferArray
}