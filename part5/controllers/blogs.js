const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')


blogsRouter.get('/', async (request, response, next) => {
  const blogs = await Blog.find({})
    .populate('creator', { username: 1, name: 1, })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  let blog = request.body

  const user = request.user

  blog.creator = user._id
  blog = new Blog(blog)

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  const populatedBlog = await savedBlog.populate('creator', { username: 1, name: 1, })

  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(400).json({ error: 'a blog with this id does not exist' })
  }
  if (!request.token) {
    return response.status(400).json({ error: 'token required for deletion' })
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

blogsRouter.put('/:id/likes', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)

  const updatedData = { likes: request.body.likes }

  const updatedBlog = await Blog
    .findByIdAndUpdate(request.params.id, updatedData, { new: true, $exists: true })
  const populatedBlog = await updatedBlog.populate('creator', { username: 1, name: 1 })

  response.json(populatedBlog)

  return response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)

  if (!request.token) {
    return response.status(401).json({ error: 'token required for update' })
  }

  if (!blog) {
    return response.status(400).json({ error: 'a blog with this id does not exist' })
  }

  const updatedData = { ...request.body, creator: blog.creator }
  const user = request.user

  if (user && user._id.toString() === blog.creator.toString()) {
    const updatedBlog = await Blog
      .findByIdAndUpdate(request.params.id, updatedData, { new: true, $exists: true })
    const populatedBlog = await updatedBlog.populate('creator', { username: 1, name: 1 })

    response.json(populatedBlog)

    return response.status(204).end()
  }

  return response.status(401).json({
    error: 'only user who created blog can update'
  })


})

module.exports = blogsRouter