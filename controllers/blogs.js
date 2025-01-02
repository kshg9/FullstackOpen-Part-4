const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const {userExtractor} = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
    .populate('user', { username: 1, name:1, id:1 })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    response.json(blog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.post('/',userExtractor, async (request, response, next) => {
  try {
    const blog = new Blog({
      ...request.body,
      likes: request.body.likes || 0,
      user: request.user._id
    })

    const savedBlog = await blog.save()
    request.user.blogs = request.user.blogs.concat(savedBlog._id)
    await request.user.save()

    response.status(201).json(savedBlog)
  }catch(error) {
    next(error)
  }
})

blogsRouter.delete('/:id',userExtractor, async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)

    if (request.user._id.toString() === blog?.user.toString()){
      await Blog.findByIdAndDelete(request.params.id)
      response.status(200).end()
    }else if (request.user._id.toString() !== blog?.user.toString()){
      return response.status(403).json({error: 'unauthorized'})
    }
    next()
  } catch (error) {
    next(error)
  }
})

blogsRouter.patch('/:id',userExtractor, async (request, response) => {
  const { likes } = request.body
  const modifiedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { likes },
    { new:true, runValidators:true }
  )
  response.json(modifiedBlog)
})

module.exports = blogsRouter