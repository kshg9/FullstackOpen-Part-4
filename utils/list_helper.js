const _ = require('lodash')

const dummy = () => {
  return 1
}

const totalLikes = (listOfBlogs) => {
  return listOfBlogs.reduce((sum, item) => {
    return sum + item.likes
  }, 0)
}

const favoriteBlog = (listOfBlogs) => {
  return listOfBlogs.reduce((fav , { title, author, likes }) => {
    return fav?.likes > likes ? fav : { title, author, likes }
  }, undefined)
}

const mostBlogs = (listOfBlogs) => {
  // const bloggers = listOfBlogs.reduce((prev_blog, current_blog) => {
  //   prev_blog[current_blog.author] = (prev_blog[current_blog.author] || 0) + 1
  //   return prev_blog
  // }, {})

  // const [topAuthor, blogCount] = Object.entries(bloggers)
  //   .reduce(([maxAuthor, maxCount], [author, count]) => {
  //     return count > maxCount ? [author, count] : [maxAuthor, maxCount]
  //   }, ['', 0])

  const blogCount = _.countBy(listOfBlogs, 'author')
  const topAuthor = _.maxBy(_.keys(blogCount), (author) => blogCount[author])

  return {
    author: topAuthor,
    blogs: blogCount[topAuthor]
  }
}

const mostLikes = (listOfBlogs) => {
  const authorLikes = _.reduce(listOfBlogs, (result, blog) => {
    result[blog.author] = (result[blog.author] || 0) + blog.likes
    return result
  }, {})

  const topAuthor = _.maxBy(_.keys(authorLikes), author => authorLikes[author])
  // keys as 'author' are extracted into array of author names and then pass them further

  return {
    author: topAuthor,
    likes: authorLikes[topAuthor]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}