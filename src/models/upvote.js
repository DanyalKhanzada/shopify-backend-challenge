const mongoose = require("mongoose")
const User = require("../models/user")
const Image = require("../models/image")

const upvoteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Image"
  },
  uploaderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
}, {
  timestamps: true
})

upvoteSchema.post("save", async function (next) {
  const upvote = this
  const uploader = await User.findOne({
    _id: upvote.uploaderId
  })
  const upvoter = await User.findOne({
    _id: upvote.userId
  })
  const image = await Image.findOne({
    uploader: upvote.uploaderId
  })
  uploader.credits++
  upvoter.credits = Math.max(upvoter.credits - 1, 0)
  image.upvotes++
  await uploader.save()
  await upvoter.save()
  await image.save()
})

upvoteSchema.post("remove", async function (next) {
  const upvote = this
  const uploader = await User.findOne({
    _id: upvote.uploaderId
  })
  const upvoter = await User.findOne({
    _id: upvote.userId
  })
  const image = await Image.findOne({
    uploader: upvote.uploaderId
  })
  uploader.credits = Math.max(uploader.credits - 1, 0)
  upvoter.credits++
  image.upvotes = Math.max(image.upvotes - 1, 0)
  await uploader.save()
  await upvoter.save()
  await image.save()
})

const Upvote = mongoose.model("Upvote", upvoteSchema)

module.exports = Upvote