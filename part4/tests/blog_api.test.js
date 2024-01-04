const helper = require('../utils/list_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')


const initialBlogs = helper.initialBlogs

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})


describe('blog list tests (4.9 - 4.12)', () => {

  test('returns amount of blogs', async () => {
    const blogs = await helper.blogsInDb()
    expect(blogs).toHaveLength(initialBlogs.length)
  })

  test('unique identifier is "id"', async () => {
    const blogs = await helper.blogsInDb()

    blogs.forEach(b => expect(b.id).toBeDefined())
  })

  test('can add a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      title: 'It\'s ecosia',
      author: 'Dustin',
      url: 'https://www.ecosia.com',
      likes: 500000,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)

    const leastRecentlyAddedBlog = await Blog.findOne({ author: 'Dustin' })

    expect(leastRecentlyAddedBlog.title).toBeDefined()
    expect(leastRecentlyAddedBlog.author).toBeDefined()
    expect(leastRecentlyAddedBlog.url).toBeDefined()
    expect(leastRecentlyAddedBlog.likes).toBeDefined()

  })

  test('default likes to 0 if likes property is missing', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const newBlog = {
      title: 'It\'s ecosia',
      author: 'Kevin',
      url: 'https://www.ecosia.com',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)

    const leastRecentlyAddedBlog = await Blog.findOne({ author: 'Kevin' })

    expect(leastRecentlyAddedBlog.title).toBeDefined()
    expect(leastRecentlyAddedBlog.author).toBeDefined()
    expect(leastRecentlyAddedBlog.url).toBeDefined()
    expect(leastRecentlyAddedBlog.likes).toBe(0)

  })

  test('can\'t add blog with missing author property', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      title: 'It\'s ecosia',
      url: 'https://www.ecosia.com',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })

  test('can\'t add blog with missing url property', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      title: 'It\'s ecosia',
      author: 'Devin',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })

  test('can\'t add blog with missing url and author property', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      title: 'It\'s ecosia',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)


    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })


})

describe('deletion tests', () => {

  test('deleting a Blog succeds with status 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const blogToDelete = blogsAtStart[0]
    deletedBlog = await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtStart).toHaveLength(blogsAtEnd.length + 1)
    expect(blogsAtEnd.find(b => b.id === deletedBlog.id)).toBeUndefined()
  })

  test('deleting an invalid blog results in error 400', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const invalidId = '1234567'

    await api
      .delete(`/api/blogs/${invalidId}`)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtStart).toHaveLength(blogsAtEnd.length)
  })

  test('deleting a nonexisting blog with valid id results in error 404', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const nonExistingId = await helper.nonExistingId()

    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtStart).toHaveLength(blogsAtEnd.length)
  })


})

describe('update tests', () => {
  test('updating a Blog succeds with status 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlogfield = { likes: -10 }

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogfield)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtStart).toHaveLength(blogsAtEnd.length)
    expect(updatedBlog.body.likes).toBe(-10)
  })

  test('updating an invalid blog results in error 400', async () => {
    const invalidId = '1234567'

    await api
      .put(`/api/blogs/${invalidId}`)
      .send({ likes: -10 })
      .expect(400)
  })

  test('updating an nonexisting blog with valid id results in no change', async () => {

    const nonExistingId = await helper.nonExistingId()

    const nonExistingBlog = await api
      .put(`/api/blogs/${nonExistingId}`, { author: 'edgar allan poe' })
      .expect(200)

    expect(nonExistingBlog.body).toBeNull()

  })

  test('updating a nonexisting field doesn\'t change blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const blogWithWrongField = await api
      .put(`/api/blogs/${blogToUpdate.id}`, { wrongfield: 'wrong' })
      .expect(200)

    expect(blogToUpdate).toEqual(blogWithWrongField.body)
  })

})

describe('testing adding creator to blog', () => {
  test('creating a blog adds a userid as creator', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
      title: 'It\'s ecosia',
      author: 'Torben',
      url: 'https://www.ecosia.com',
      likes: 500000,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)

    const leastRecentlyAddedBlog = await Blog.findOne({ author: 'Torben' })

    expect(leastRecentlyAddedBlog.title).toBeDefined()
    expect(leastRecentlyAddedBlog.creator).toBeDefined()
    expect(leastRecentlyAddedBlog.author).toBeDefined()
    expect(leastRecentlyAddedBlog.url).toBeDefined()
    expect(leastRecentlyAddedBlog.likes).toBeDefined()
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})