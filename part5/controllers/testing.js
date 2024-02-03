const testingRouter = require('express').Router()
const  Blog = require('../models/blog')
const User = require('../models/user')

testingRouter.post('/reset', async (req, res) => {
    console.log("tryin to reset ...")
    await Blog.deleteMany({})
    await User.deleteMany({})

    res.status(204).end()
})

module.exports = testingRouter