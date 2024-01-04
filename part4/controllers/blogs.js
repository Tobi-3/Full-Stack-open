const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.find({})
    .populate('creator', { username: 1, name: 1, })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  let blog = request.body

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken) {
    return response.status(401).json({ error: 'invalid token' })
  }
  const user = request.user

  blog.creator = user._id
  blog = new Blog(blog)

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)

  if (!request.token) {
    return response.status(400).json({ error: 'token required for deletion' })
  }

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken) {
    return response.status(401).json({ error: 'invalid token' })
  }

  const user = request.user

  if (user && user._id.toString() === blog.creator.toString()) {
    const deletedBlog = await Blog.findByIdAndDelete(request.params.id)

    user.blogs = user.blogs
      .filter(blogId => blogId.toString() !== deletedBlog._id.toString())
    await user.save()

    return response.status(204).end()
  }

  return response.status(401).json({
    error: 'only user who created blog can delete'
  })

})

blogsRouter.put('/:id', async (request, response, next) => {
  const blog = request.body

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true, $exists: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter