const express = require("express")
const router = new express.Router()
const mongoose = require("mongoose")
const Upvote = require("../models/upvote")
const Image = require("../models/image")
const auth = require("../middleware/auth")

// upvoteImage
// Creates an upvote.Credits transactions managed through hooks
// Params: {imageId}
router.post("/upvote", auth, async (req, res) => {
  try {
    const image = await Image.findById(req.body.imageId)
    if (req.user._id.toString() == image.uploader.toString()) {
      res.status(400).send("Can not upvote your own photos")
    }
    if (req.user.credits == 0) {
      res.status(400).send("Insufficient Credits: Please upload photos to earn credits.")
    }
    const upvote = await new Upvote({
      userId: req.user._id,
      imageId: image._id,
      uploaderId: image.uploader
    })
    await upvote.save()
    res.status(201).send()
  } catch (err) {
    res.status(400).send(err)
  }
})

// removeUpvote - Fails silently
// Removes an upvote.Credits transactions managed through hooks
// Params: {imageId}
router.delete("/upvote", auth, async (req, res) => {
  try {
    const upvote = await Upvote.findOne({
      imageId: req.body.imageId,
      userId: req.user._id
    })
    await upvote.remove()
    res.status(200).send()
  } catch {
    res.status(400).send()
  }
})

module.exports = router