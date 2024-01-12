import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotification] = useState(null)

  const setNotificationWithTimeout = (message, err = false, timeout = 5000) => {
    setNotification({ message, err })
    setTimeout(() => {
      setNotification(null)
    }, timeout);
  }
  
  useEffect(() => {
    blogService
      .getAll()
      .then(blogs =>
        setBlogs(blogs)
      )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      setUser(user)
      setUsername('')
      setPassword('')

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    } catch (error) {
      setNotificationWithTimeout(error.response.data.error, true)
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    setNotificationWithTimeout('logged out successfully')
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title,
      author,
      url
    }

    try {
      const addedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(addedBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      setNotificationWithTimeout(`Added blog "${blogObject.title}" by ${blogObject.author}`)
    } catch(error) {
      setNotificationWithTimeout(error.response.data.error, true)
    }
  }

  const loginForm = () => (<div>
    <h2>log in to application</h2>
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          name="Username"
          value={username}
          onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password
        <input
          type="text"
          name="Password"
          value={password}
          onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit">login</button>
    </form>
  </div>)

  const blogForm = () => (
    <div>
      <h2>create new blog</h2>
      <form onSubmit={addBlog}>
        <div>title: <input type="text" name="title" value={title} onChange={({ target }) => setTitle(target.value)} /></div>
        <div>author: <input type="text" name="author" value={author} onChange={({ target }) => setAuthor(target.value)} /></div>
        <div>url: <input type="text" name="url" value={url} onChange={({ target }) => setUrl(target.value)} /></div>
        <button type="submit">create</button>
      </form>
    </div>
  )

  if (!user) {
    return <>
      <Notification notification={notification} />
      {loginForm()}
    </>
  }

  return (
    <>
      <Notification notification={notification} />
      <p>Logged in as {user.username} <button onClick={handleLogout}>logout</button></p>
      {blogForm()}
      <div>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    </>
  )
}

export default App