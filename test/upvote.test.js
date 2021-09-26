const request = require("supertest");
const server = require("../src/server");

const {
  userTwo,
  userThree,
  userOneImageOneId,
  userTwoImageOneId,
  userTwoImageTwoId,
  setUpDatabase,
  userOne
} = require("./mocks/database")

beforeAll(setUpDatabase)

// Starting Credits:
// UserOne: 2
// UserTwo: 2
// UserThree: 0

test("Should not upvote if a user has no credits", async () => {
  await request(server)
    .post("/upvote")
    .set("Authorization", `Bearer ${userThree.tokens[0].token}`)
    .send({
      "imageId": userOneImageOneId
    })
    .expect(400)
})

// Create an upvote, decrement user's credits and increments uploader + image upvotes
test("Should upvote if a user has enough credits", async () => {
  await request(server)
    .post("/upvote")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      "imageId": userOneImageOneId
    })
    .expect(201)

  const userTwoResponsePost = await request(server)
    .get("/users/me")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .expect(200)
  expect(userTwoResponsePost.body.credits).toBe(1)

  const imageResponse = await request(server)
    .get("/image/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200)
  expect(imageResponse.body[0].upvotes).toBe(1)

  const userOneResponsePost = await request(server)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200)
  expect(userOneResponsePost.body.credits).toBe(3)
})

test("Should not upvote a user's own post", async () => {
  await request(server)
    .post("/upvote")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      "imageId": userTwoImageOneId
    })
    .expect(400)
})

test("Should delete an upvote and return credits", async () => {
  await request(server)
    .delete("/upvote")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      "imageId": userOneImageOneId
    })
    .expect(200)

  const userTwoResponsePost = await request(server)
    .get("/users/me")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .expect(200)
  expect(userTwoResponsePost.body.credits).toBe(2)

  const imageResponse = await request(server)
    .get("/image/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200)
  expect(imageResponse.body[0].upvotes).toBe(0)

  const userOneResponsePost = await request(server)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200)
  expect(userOneResponsePost.body.credits).toBe(2)
})

test("Should not delete an upvote that never existed", async () => {
  await request(server)
    .delete("/upvote")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      "imageId": userTwoImageTwoId
    })
    .expect(400)
})