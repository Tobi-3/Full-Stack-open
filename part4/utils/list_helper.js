const _ = require('lodash')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  }
]
const initialUsers = [
  {
    username: "hellas",
    name: "Artos Hellas",
    passwordHash: "$2b$10$58epcrWRRD9/tBuEN8GmaO7zwPvnU9rD5226d3my8l3zupO8mmSYy"
  },
  {
    username: "mluukkai",
    name: "Matti Luukkainen",
    passwordHash: "$2b$10$qRu8zxBH4Fg2OAAplrn/UegFAB9tiwwJhgqRmwKfpTBjK7paIkwuq"
  },

]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({ title: 'to be removed', author: 'author', url: 'url', likes: 0 })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}


const dummy = (blogs) => {
  return 1
}


const totalLikes = (blogs) => {
  const sumLikes = (sum, blog) => sum + blog.likes

  return blogs.reduce(sumLikes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let currentFavorite = blogs[0]

  blogs.forEach(blog => {
    if (currentFavorite.likes < blog.likes) {
      currentFavorite = blog
    }
  });


  return {
    title: currentFavorite.title,
    author: currentFavorite.author,
    likes: currentFavorite.likes
  }

}

const mostBlogs = (blogs) => {
  if (_.isEmpty(blogs)) return null

  blogsPerAuthor = _.countBy(blogs, 'author')
  authorWithMostBlogs =
    _.maxBy(Object.entries(blogsPerAuthor)
      .map(([key, value]) => { return { author: key, blogs: value } }), 'blogs')

  return authorWithMostBlogs
}

const mostLikes = (blogs) => {
  if (_.isEmpty(blogs)) return null

  const authors = _.groupBy(blogs, 'author')
  const totalLikesPerAuthor = Object.entries(authors).map(([author, blogs]) => {
    const likes = blogs.reduce((acc, blog) => acc + blog.likes, 0)
    return { author, likes }
  })

  authorWithMostLikes = _.maxBy(totalLikesPerAuthor, 'likes')

  return authorWithMostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  initialBlogs,
  initialUsers,
  blogsInDb,
  usersInDb,
  nonExistingId,
}