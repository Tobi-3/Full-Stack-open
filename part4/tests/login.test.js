const helper = require('../utils/list_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

const initialUsers = helper.initialUsers
const initialUsersLogin = helper.initialUsersLogin

// beforeEach(async () => {
//   await User.deleteMany({})
//   await User.insertMany(initialUsers)
// })

describe('login tests', () => {
  test('returns status 401 if password is wrong', async () => {
    const user = initialUsersLogin[0]

    const wrongData = {
      username: user.username,
      password: 'wrong password'
    }
    await api.post('/api/login')
      .send(wrongData)
      .expect(401)
  })

  test('returns status 200 if password is correct', async () => {
    const user = initialUsersLogin[1]

    const res = await api.post('/api/login')
      .send(user)
      .expect(200)
  })




})

afterAll(async () => {
  await mongoose.connection.close()
})
