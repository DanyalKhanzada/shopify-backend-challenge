const express = require("express")
const router = new express.Router()
const mongoose = require("mongoose")
const {
  upload,
  createBufferArray
} = require("../middleware/upload")
const auth = require("../middleware/auth")
const Image = require("../models/image")

// uploadImage
// Params: { private: bool, images: Image}
router.post("/image", auth, upload.array("images"), async (req, res) => {
  try {
    if (req.files.length == 0) {
      res.status(400).send("Please include a photo")
    }
    const imageBufferArray = await createBufferArray(req.files)
    await Promise.all(imageBufferArray.map((buffer) => {
      const image = new Image({
        image: buffer,
        uploader: req.user._id,
        private: req.body.private
      })
      return image.save()
    })).then((buffers) => {
      res.status(201).send(buffers)
    })
  } catch (err) {
    res.status(400).send()
  }
})

// getUploads
// Params: { ?userId: string, ?private: string(bool),}
// userId<Optional>: If not the same ID as the requesting user, this will only return public images.
router.get("/image", auth, async (req, res) => {
  try {
    const match = {
      private: false
    }
    if (req.body.userId) {
      match.uploader = mongoose.Types.ObjectId(req.body.userId)
    }
    const images = await Image.find(match)
    const filtered = images.filter((image) => {
      return image.uploader.toString() != req.user._id.toString()
    })
    res.send(filtered)
  } catch (err) {
    res.status(400).send()
  }
})

// getSelfUploads
// GET uploads/me?private={bool}
// Params: N/A
router.get("/image/me", auth, async (req, res) => {
  try {
    const match = {}
    if (req.query.private) {
      match.private = req.query.private == "true"
    }
    match.uploader = req.user._id
    const images = await Image.find(match)
    res.send(images)
  } catch (err) {
    res.status(400).send()
  }
})

// toggleImagePrivacy
// Request Params {imageIds: [{imageId}], private: Bool}
router.patch("/image", auth, async (req, res) => {
  try {
    if (req.body.private == undefined) {
      res.status(400).send("Please set privacy to true or false")
    }
    const imageIds = req.body.imageIds
    const images = await Image.find({
      uploader: req.user._id
    }).where("_id").in(imageIds).exec()
    if (images.length == 0) {
      res.status(404).send()
    }
    await Promise.all(images.map((image) => {
      image.private = req.body.private
      return image.save()
    })).then(() => {
      res.status(200).send(images)
    })
  } catch (err) {
    res.status(400).send()
  }
})

// deleteUploadsById
// Allows for batch deletes
// Params: imageIds: [{imageId}]
router.delete("/image", auth, async (req, res) => {
  try {
    const imageIds = req.body.imageIds
    const images = await Image.find({
      uploader: req.user._id
    }).where("_id").in(imageIds).exec()
    if (images.length == 0) {
      res.status(400).send()
    }
    Promise.all(images.map((image) => {
      Image.deleteOne({
        _id: image._id
      })
    })).then(() => {
      res.status(202).send()
    })
  } catch (err) {
    res.status(400).send()
  }
})

// deleteAllUploads
// Async delete sends 202 and processes deletions in the background
// This id is tied to the user's token
// Params: N/A
router.delete("/image/all", auth, async (req, res) => {
  try {
    Image.deleteMany({
      uploader: req.user._id
    })
    res.status(202).send()
  } catch (err) {
    res.status(400).send()
  }
})

module.exports = router