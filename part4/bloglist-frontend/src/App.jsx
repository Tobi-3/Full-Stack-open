import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()

  const setNotificationWithTimeout = (message, err = false, timeout = 5000) => {
    setNotification({ message, err })
    setTimeout(() => {
      setNotification(null)
    }, timeout);
  }

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => setBlogs(blogs.sort((a, b) => { return b.likes - a.likes })))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (userObject) => {

    try {
      const user = await loginService.login(userObject)

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)

    } catch (error) {
      setNotificationWithTimeout(error.response.data.error, true)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setNotificationWithTimeout('logged out successfully')
    window.location.reload()
  }

  const addBlog = async (blogObject) => {
    try {
      const addedBlog = await blogService.create(blogObject)

      blogFormRef.current.toggleVisibility()

      setBlogs((blogs).concat(addedBlog))
      setNotificationWithTimeout(`Added blog "${blogObject.title}" by ${blogObject.author}`)

    } catch (error) {
      console.log(error)
      const message = error.response.data.error
      console.log(error)
      setNotificationWithTimeout(message ? message : error, true)
    }
  }

  const updateBlog = async (blogObject) => {
    try {
      const updatedBlog = await blogService.update(blogObject)
      setBlogs([...blogs]
        .map(b => b.id === updatedBlog.id ? updatedBlog : b)
        .sort((a, b) => { return b.likes - a.likes }))

    } catch (error) {
      setNotificationWithTimeout(error.response.data.error, true)
    }
  }

  const deleteBlog = async (blogId) => {
    try {      
      await blogService.remove(blogId)
      
      setBlogs(blogs.filter(b => b.id !== blogId))
      setNotificationWithTimeout('deleted blog')

    } catch (error) {
      console.log("errror", error)
      setNotificationWithTimeout(error.response.data.error, true)
    }
  }

  const loginForm = () => <LoginForm handleSubmit={handleLogin} />
  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>)

  if (!user) {
    return <>
      <Notification notification={notification} />
      {loginForm()}
    </>
  }


  return (
    <>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>Logged in as {user.username} <button onClick={handleLogout}>logout</button></p>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} userId={user.id}/>
      )}

    </>
  )
}

export default App