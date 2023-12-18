const _ = require('lodash')
const Blog = require('../models/blog')
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

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
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
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes, initialBlogs, blogsInDb, nonExistingId
}