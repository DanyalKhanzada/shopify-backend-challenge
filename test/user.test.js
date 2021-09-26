const request = require("supertest");
const server = require("../src/server.js");
const {
  setUpDatabase,
  userOne
} = require("./mocks/database")
const User = require("../src/models/user")

beforeAll(setUpDatabase)

// Account Creation / Login
test("Should register a new user", async () => {
  const username = 'testUser1'
  const password = 'weakPassword1'
  const response = await request(server)
    .post('/users')
    .send({
      username,
      password
    })
    .expect(201);

  // Assert that user was added to database
  const user = await User.findById(response.body.user._id)
  expect(user).not.toBeNull()

  expect(user.credits).toBe(1)
  expect(response.body).toMatchObject({
    user: {
      username
    },
    token: user.tokens[0].token
  })
});

test("Should not signup invalid user", async () => {
  await request(server)
    .post('/users')
    .send({})
    .expect(400)
})

test("Should not create an account if username already exists", async () => {
  const username = 'newUser1'
  const password = 'mypass123'
  await request(server)
    .post("/users")
    .send({
      username,
      password,
    })
    .expect(201);
  await request(server)
    .post("/users")
    .send({
      username,
      password,
    })
    .expect(400);
});

test('Should login existing user', async () => {
  const response = await request(server).post('/users/login').send({
    username: userOne.username,
    password: userOne.password
  }).expect(200)

  const user = await User.findById(userOne._id)
  expect(user).toMatchObject({
    username: userOne.username,
    _id: userOne._id,
  })
  expect(user).not.toBeNull()
  expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login non-existing user', async () => {
  await request(server).post('/users/login').send({
    username: 'nonexistent',
    password: 'asdf123!'
  }).expect(400)
})

// Authentication (access control) tests
test('Should get profile for user', async () => {
  await request(server)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
  await request(server)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete user account', async () => {
  await request(server)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(202)

  const user = await User.findById(userOne._id)
  expect(user).toBeNull()
})

test('Should not delete unauthenticated user account', async () => {
  await request(server)
    .delete('/users/me')
    .send()
    .expect(401)
})