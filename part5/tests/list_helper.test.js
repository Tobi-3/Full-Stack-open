const helper = require('../utils/list_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

mongoose.set('bufferTimeoutMS', 30000)

const initialBlogs = helper.initialBlogs


test('dummy returns one', () => {

  const result = helper.dummy(initialBlogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]



  test('when list has only one blog, equals the likes of that', () => {
    const result = helper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('multiple blogs, expecting 36 likes', () => {
    const result = helper.totalLikes(initialBlogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {


  test('expecting favorite blog to be { title: "Canonical string reduction", \
  author: "Edsger W. Dijkstra", likes: 12 }', () => {
    const result = helper.favoriteBlog(initialBlogs)
    expect(result).toEqual({
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    })
  })

  test('expecting empty blog list to return null', () => {
    const result = helper.favoriteBlog([])
    expect(result).toBe(null)
  })

})

describe('most blogs', () => {


  test('expecting author with most blogs to be "Robert C. Martin"', () => {
    const result = helper.mostBlogs(initialBlogs)

    expect(result).toEqual({
      author: "Robert C. Martin",
      blogs: 3
    })
  })

  test('expecting empty blog list to return null', () => {
    const result = helper.mostBlogs([])
    expect(result).toBe(null)
  })

})

describe('most likes', () => {


  test('expecting author with most likes to be equal to { author: "Edsger W.Dijkstra", likes: 17 }', () => {
    const result = helper.mostLikes(initialBlogs)

    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 17 })
  })

  test('expecting empty blog list to return null', () => {
    const result = helper.mostLikes([])
    expect(result).toBe(null)
  })

})


afterAll(async () => {
  await mongoose.connection.close()
})