const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://ksh:${password}@cluster0.ubxhm.mongodb.net/bloglist?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
  })

  const Blog = mongoose.model('Blog', blogSchema)

  // const blog = new Blog({
  //   title: 'A tale',
  //   author: 'dno',
  //   url: 'google.com',
  //   likes: '44'
  // })

  // blog.save().then(result => {
  //   console.log('blog saved!')
  // })

  Blog.find({}).then(result => {
    console.log('Blogs:')
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
})