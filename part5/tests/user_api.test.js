const helper = require('../utils/list_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

const initialUsers = helper.initialUsers

// beforeEach(async () => {
//   await User.deleteMany({})
//   await User.insertMany(initialUsers)
// })

describe('user tests', () => {
  test('returns status 400 if password is to short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'user',
      name: 'user',
      password: 'no'
    }

    await api.post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('returns status 400 if username not unique', async () => {
    const newUser = {
      username: 'mluukkai',
      name: 'user',
      password: 'yes'
    }

    await api.post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('returns status 400 if password not given', async () => {
    const newUser = {
      username: 'oneOfAKind'
    }

    await api.post('/api/users')
      .send(newUser)
      .expect(400)
  })

  test('returns status 400 if username not given', async () => {
    const newUser = {
      name: 'username',
      password: 'yes'
    }

    await api.post('/api/users')
      .send(newUser)
      .expect(400)
  })



})

afterAll(async () => {
  await mongoose.connection.close()
})
