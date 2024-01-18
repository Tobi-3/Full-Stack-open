import { useState } from "react"

const Blog = ({ blog, updateBlog, deleteBlog, userId }) => {
  const [hideBlog, setHideBlog] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const style = {
    border: '1px solid black',
    paddingTop: 10,
    paddingLeft: 2,
    marginBottom: 5
  }
  const removeStyle = { backgroundColor: 'rgb(100, 180, 255)' }
  const toggleVisibility = () => setHideBlog(!hideBlog)
  const handleLike = () => {
    const updatedLikes = isLiked ? blog.likes - 1 : blog.likes + 1

    updateBlog({ ...blog, likes: updatedLikes })

    //allow unlimited likes for now
    // setIsLiked(!isLiked)
  }
  const handleDelete = (event) => {
    event.preventDefault()
    if (window.confirm(`do you really want to delete ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  return (
    <div style={style}>
      <div> {blog.title} <button onClick={toggleVisibility}>{hideBlog ? 'view' : 'hide'}</button></div >
      {
        hideBlog
          ? <></>
          : <>
            <div>{blog.author}</div>
            <a href={blog.url}>{blog.url}</a>
            <div>likes: {blog.likes} <button onClick={handleLike}>{isLiked ? 'unlike' : 'like'}</button> </div>
            <div>{blog.creator.name}</div>
          </>
      }
      {userId === blog.creator.id ? <button style={removeStyle} onClick={handleDelete}>delete post</button> : <></>}
    </div >
  )
}

export default Blog