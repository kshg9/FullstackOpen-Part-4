const Blog = require('../models/blog')
const User = require('../models/user')
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  }
]

const initialUsers = [
  {
    username: 'MichaelChan',
    name: 'Michael Chan',
    password: 'sekret'
  },
  {
    username: 'EdsgerWDijkstra',
    name: 'Edsger W. Dijkstra',
    password: 'salainen'
  }
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(u => u.toJSON())
}

const createTestUser = async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({
    username: 'testuser',
    name: 'Test User',
    passwordHash
  })
  return await user.save()
}

const getUserAndToken = async () => {
  const user = await createTestUser()
  const userForToken = {
    username: user.username,
    id: user._id
  }
  const token = jwt.sign(userForToken, process.env.SECRET)
  return {token, user}
}

const checkBlogsIncludes = (blogsAtEnd, includedBlog) => {
  return _.some(blogsAtEnd, blog => _.isEqual(blog, includedBlog))
}

module.exports = {
  initialBlogs,
  initialUsers,
  blogsInDb,
  usersInDb,
  checkBlogsIncludes,
  getUserAndToken,
  createTestUser
}