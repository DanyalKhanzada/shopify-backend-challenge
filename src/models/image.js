const mongoose = require("mongoose")
const User = require("../models/user")
const imageSchema = new mongoose.Schema({
  image: {
    type: Buffer,
    required: true
  },
  private: {
    type: Boolean,
    default: false
  },
  upvotes: {
    type: Number,
    default: 0,
    min: 0
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
}, {
  timestamps: true
})

imageSchema.pre("save", async function (next) {
  if (this.isNew) {
    const image = this
    const user = await User.findById(image.uploader)
    user.credits++
    await user.save()
    next()
  }
})

const Image = mongoose.model("Image", imageSchema)

module.exports = Image