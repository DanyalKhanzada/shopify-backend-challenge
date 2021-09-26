const request = require("supertest");
const server = require("../src/server");
const {
  userOne,
  userTwo,
  userOneImageOne,
  userTwoImageOneId,
  userTwoImageTwoId,
  setUpDatabase
} = require("./mocks/database")

beforeAll(setUpDatabase)

// READ operations here are using the data generated in mocks
test("Should get the user's own uploads", async () => {
  const response = await request(server)
    .get("/image/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200)

  expect(response.body.length).toBe(2)
}, 100000)

test("Should get the user's own private uploads", async () => {
  const response = await request(server)
    .get("/image/me?private=true")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200)

  expect(response.body.length).toBe(1)
})

test("Should get the user's own public uploads", async () => {
  const response = await request(server)
    .get("/image/me?private=false")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200)

  expect(response.body.length).toBe(1)
})

// 1 private and 1 public image are associated to UserTwo
test("Should get all images uploaded by other users", async () => {
  const response = await request(server)
    .get("/image")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(200)
  expect(response.body.length).toBe(1)
}, 100000)

test("Should not get all images of other users", async () => {
  await request(server)
    .get("/image")
    .set("Authorization", `Bearer incorrect`)
    .expect(401)
})

test("Should get all public images uploaded by another specified user", async () => {
  const response = await request(server)
    .get("/image")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      "userId": userTwo._id
    })
    .expect(200)
  expect(response.body.length).toBe(1)
})

// CREATE
// Upload Image - requires authentication
test("Should upload a single public image", async () => {
  const response = await request(server)
    .post("/image")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("images", "test/assets/test_image.jpg")
    .expect(201)

  expect(response.body[0].private).toBe(false)
}, 10000)

test("Should upload a multiple public images", async () => {
  const response = await request(server)
    .post("/image")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("images", "test/assets/test_image.jpg")
    .attach("images", "test/assets/test_image2.png")
    .expect(201)

  expect(response.body[0].private).toBe(false)
}, 10000)

test("Should upload a single private image", async () => {
  const response = await request(server)
    .post("/image")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("images", "test/assets/test_image.jpg")
    .expect(201)

  expect(response.body[0].private).toBe(false)
}, 10000)

test("Should not upload an image if not authenticated", async () => {
  await request(server)
    .post("/image")
    .set("Authorization", "Bearer incorrect")
    .attach("images", "test/assets/test_image.jpg")
    .expect(401)
})

test("Should not get the uploads of a user not authenticated", async () => {
  await request(server)
    .get("/image/me")
    .set("Authorization", `Bearer incorrect`)
    .expect(401)

})

test("Should not get the uploads of a user without a token", async () => {
  await request(server)
    .get("/image/me")
    .expect(401)
})

// userOneImageOne is public -> toggle to private
test("Should set an image to private", async () => {
  const response = await request(server)
    .patch("/image")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      "private": true,
      "imageIds": [userOneImageOne._id]
    })
    .expect(200)

  expect(response.body[0].private).toBe(true)
})

// Toggle userOneImageOne back to public
test("Should set an image to public", async () => {
  const response = await request(server)
    .patch("/image")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      "private": false,
      "imageIds": [userOneImageOne._id]
    })
    .expect(200)

  expect(response.body[0].private).toBe(false)
})

test("Should not delete another users image by ID", async () => {
  await request(server)
    .delete("/image")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      "imageIds": [userTwoImageOneId, userTwoImageTwoId]
    })
    .expect(400)

  const response = await request(server)
    .get("/image/me")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .expect(200)
  expect(response.body.length).toBe(2)
})


test("Should batch delete a user's image by ID", async () => {
  await request(server)
    .delete("/image")
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send({
      "imageIds": [userTwoImageOneId, userTwoImageTwoId]
    })
    .expect(202)
}, 10000)

test("Should delete all of a user's images", async () => {
  await request(server)
    .delete("/image/all")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .expect(202)
})
// Integration Tests
// Should increment the credits of a user when a user uploads an image