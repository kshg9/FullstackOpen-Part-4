const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const helper = require('./test_helper')
const User = require('../models/user')

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const user = await helper.createTestUser()
    const blogsWithUser = helper.initialBlogs.map(blog => ({
      ...blog,
      user: user._id
    }))
    await Blog.insertMany(blogsWithUser)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  describe('addition of a new blog', () => {
    test('succeeds with valid data and token', async () => {
      const { token } = await helper.getUserAndToken()

      const newBlog = {
        title: 'Test Blog',
        author: 'Tester',
        url: 'http://test.com',
        likes: 0
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    })

    test('fails with status code 401 if token not provided', async () => {
      const newBlog = {
        title: 'Test Blog',
        author: 'Tester',
        url: 'http://test.com'
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if valid id and token', async () => {
      const { token } = await helper.getUserAndToken()

      const newBlog = {
        title: 'Test Blog',
        author: 'Tester',
        url: 'http://test.com',
        likes: 0,
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)

      await api
        .delete(`/api/blogs/${response.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      assert(!blogsAtEnd.find(b => b.id === response.body.id))
    })
  })

  describe('update of a blog', () => {
    test('succeeds with partial update', async () => {
      const { token } = await helper.getUserAndToken()

      // Create a blog first
      const newBlog = {
        title: 'Test Blog',
        author: 'Tester',
        url: 'http://test.com',
        likes: 0
      }

      const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)

      await api
        .patch(`/api/blogs/${response.body.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ likes: 999 })
        .expect(200)

      const updatedBlog = await Blog.findById(response.body.id)
      assert.strictEqual(updatedBlog.likes, 999)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})

