const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}


const totalLikesPerAuthor = (blogs) => {
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
  dummy, totalLikesPerAuthor, favoriteBlog, mostBlogs, mostLikes
}