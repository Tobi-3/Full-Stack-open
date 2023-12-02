const helper = require('../utils/list_helper')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

mongoose.set('bufferTimeoutMS', 30000)

const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})

  const blogObjects = initialBlogs
    .map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

const blogsInDb = async () => {
  const response = await api.get('/api/blogs')
  return response.body
}

test('dummy returns one', () => {

  const result = helper.dummy(initialBlogs)
  expect(result).toBe(1)
})

describe('blog list tests (4.9 - 4.12)', () => {

  test('returns amount of blogs', async () => {
    const blogs = await blogsInDb()
    console.log("blogs in amount of", blogs.length, blogs)

    expect(blogs).toHaveLength(initialBlogs.length)
  })

  test('unique identifier is "id"', async () => {
    const blogs = await blogsInDb()

    blogs.forEach(b => expect(b.id).toBeDefined())
  })

  test('can add a note', async () => {
    const blogsAtStart = await blogsInDb()
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

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)

    const leastRecentlyAddedBlog = await Blog.findOne({ author: 'Dustin' })

    expect(leastRecentlyAddedBlog.title).toBeDefined()
    expect(leastRecentlyAddedBlog.author).toBeDefined()
    expect(leastRecentlyAddedBlog.url).toBeDefined()
    expect(leastRecentlyAddedBlog.likes).toBeDefined()

  })

  test('default likes to 0 if likes property is missing', async () => {
    const blogsAtStart = await blogsInDb()
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

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)

    const leastRecentlyAddedBlog = await Blog.findOne({ author: 'Kevin' })

    expect(leastRecentlyAddedBlog.title).toBeDefined()
    expect(leastRecentlyAddedBlog.author).toBeDefined()
    expect(leastRecentlyAddedBlog.url).toBeDefined()
    expect(leastRecentlyAddedBlog.likes).toBe(0)

  })

  test('can\'t add blog with missing author property', async () => {
    const blogsAtStart = await blogsInDb()

    const newBlog = {
      title: 'It\'s ecosia',
      url: 'https://www.ecosia.com',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      
      const blogsAtEnd = await blogsInDb()
    
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })
 
  test('can\'t add blog with missing url property', async () => {
    const blogsAtStart = await blogsInDb()

    const newBlog = {
      title: 'It\'s ecosia',
      author: 'Devin',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      
      const blogsAtEnd = await blogsInDb()
    
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })

  test('can\'t add blog with missing url and author property', async () => {
    const blogsAtStart = await blogsInDb()

    const newBlog = {
      title: 'It\'s ecosia',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
   

    const blogsAtEnd = await blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
  })


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