const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require("../../src/models/user")
const Image = require("../../src/models/image")

const userOneId = new mongoose.Types.ObjectId()
const userTwoId = new mongoose.Types.ObjectId()
const userThreeId = new mongoose.Types.ObjectId()

const userOneImageOneId = new mongoose.Types.ObjectId()
const userOneImageTwoId = new mongoose.Types.ObjectId()

const userTwoImageOneId = new mongoose.Types.ObjectId()
const userTwoImageTwoId = new mongoose.Types.ObjectId()

const userOne = {
  _id: userOneId,
  credits: 0,
  username: "user1",
  password: 'test123',
  tokens: [{
    token: jwt.sign({
      _id: userOneId
    }, process.env.JWT_SECRET)
  }]
}

const userTwo = {
  _id: userTwoId,
  credits: 0,
  username: "user2",
  password: 'test123',
  tokens: [{
    token: jwt.sign({
      _id: userTwoId
    }, process.env.JWT_SECRET)
  }]
}

const userThree = {
  _id: userThreeId,
  credits: 0,
  username: "user3",
  password: 'test123',
  tokens: [{
    token: jwt.sign({
      _id: userThreeId
    }, process.env.JWT_SECRET)
  }]
}


const userOneImageOne = {
  _id: userOneImageOneId,
  private: false,
  upvotes: 0,
  image: "+vAFMqdmf8HaOd912WhSowAAAAASUVORK5CYII=",
  uploader: userOneId,
  createdAt: "2020-05-26T04:01:19.620Z",
  updatedAt: "2020-05-26T04:01:19.620Z"
}

const userOneImageTwo = {
  _id: userOneImageTwoId,
  private: true,
  upvotes: 0,
  image: "+vAFMqdmf8HaOd912WhSowAAAAASUVORK5CYII=",
  uploader: userOneId,
  createdAt: "2020-05-26T04:01:19.620Z",
  updatedAt: "2020-05-26T04:01:19.620Z"
}

const userTwoImageOne = {
  _id: userTwoImageOneId,
  private: true,
  upvotes: 0,
  image: "+vAFMqdmf8HaOd912WhSowAAAAASUVORK5CYII=",
  uploader: userTwoId,
  createdAt: "2020-05-26T04:01:19.620Z",
  updatedAt: "2020-05-26T04:01:19.620Z"
}

const userTwoImageTwo = {
  _id: userTwoImageTwoId,
  private: false,
  upvotes: 0,
  image: "+vAFMqdmf8HaOd912WhSowAAAAASUVORK5CYII=",
  uploader: userTwoId,
  createdAt: "2020-05-26T04:01:19.620Z",
  updatedAt: "2020-05-26T04:01:19.620Z"
}

const setUpDatabase = async () => {
  await User.deleteMany({})
  await Image.deleteMany({})
  await new User(userOne).save()
  await new User(userTwo).save()
  await new User(userThree).save()
  await new Image(userOneImageOne).save()
  await new Image(userOneImageTwo).save()
  await new Image(userTwoImageOne).save()
  await new Image(userTwoImageTwo).save()
}

module.exports = {
  setUpDatabase,
  userOneImageOne,
  userOneImageTwo,
  userOneImageOneId,
  userOneImageTwoId,
  userOne,
  userTwo,
  userOneId,
  userTwoId,
  userTwoImageOneId,
  userTwoImageTwoId,
  userThree
}