const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  if (request.token) logger.info('Token:  ', request.token)
  if (request.user) logger.info('User:  ', request.user)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: error.message })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

const getTokenFrom = request => {
  const authz = request.get('authorization')
  const token = (authz && authz.toLowerCase().startsWith('Bearer'))
    ? authz.replace('bearer ', '')
    : null
  return token
}
const tokenExtractor = (request, response, next) => {

  request.token = getTokenFrom(request)

  next()

}

const userExtractor = async (request, response, next) => {
  const token = getTokenFrom(request)

  if (!token) {
    request.user = null
  } else {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    request.user = await User.findById(decodedToken.id)
  }

  next()
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}