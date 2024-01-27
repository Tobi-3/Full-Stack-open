import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Blog from './Blog'
import BlogForm from './BlogForm'



const blog = {
  title: 'Title of blog',
  author: 'Author of blog',
  url: 'url.ofthe.blog',
  likes: 24,
  creator: {
    username: 'username',
    name: 'name',
    id: '1234'
  }
}



describe('test rendering of blogs', () => {
  test('renders title and author, but by default does not render url or number of likes', () => {
    const updateBlog = jest.fn()
    const deleteBlog = jest.fn()
    const userId = '12345'

    const { container } = render(<Blog blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} userId={userId} />)

    const titleAuthor = container.querySelector('#titleAuthor')
    const url = screen.queryByText('url.ofthe.blog')
    const likes = screen.queryByText('24')

    expect(titleAuthor).toHaveTextContent('Title of blog Author of blog')
    expect(url).toBeNull()
    expect(likes).toBeNull()
  })

  test('url and likes are shown after clicking on details button', async () => {
    const updateBlog = jest.fn()
    const deleteBlog = jest.fn()
    const userId = '12345'

    const { container } = render(<Blog blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} userId={userId} />)

    const user = userEvent.setup()
    const button = container.querySelector('#toggleVisibilityButton')
    await user.click(button)

    const url = screen.queryByText('url.ofthe.blog')
    const likes = screen.queryByText('likes: 24')

    expect(button).toHaveTextContent('hide')
    expect(url).toHaveTextContent('url.ofthe.blog')
    expect(likes).toHaveTextContent('likes: 24')
  })

  test('if likes is clicked twice, the event handler is called twice', async () => {
    const updateBlog = jest.fn()
    const deleteBlog = jest.fn()
    const userId = '12345'

    const { container } = render(<Blog blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} userId={userId} />)

    const user = userEvent.setup()
    const toggleButton = container.querySelector('#toggleVisibilityButton')
    await user.click(toggleButton)

    const likeButton = container.querySelector('#likeButton')
    await user.click(likeButton)
    await user.click(likeButton)

    const url = screen.queryByText('url.ofthe.blog')
    const likes = screen.queryByText('likes: 24')

    expect(toggleButton).toHaveTextContent('hide')
    expect(updateBlog.mock.calls).toHaveLength(2)

  })
})

test('new blog form calls received event handler with right details', async () => {
  const newBlog = { title: 'Title', author: 'Author', url: 'Url' }

  const createBlog = jest.fn()
  render(<BlogForm createBlog={createBlog} />)

  const user = userEvent.setup()

  const inputs = screen.getAllByRole('textbox')
  await user.type(inputs[0], newBlog.title)
  await user.type(inputs[1], newBlog.author)
  await user.type(inputs[2], newBlog.url)

  const submitButton = await screen.findByText('create')
  await user.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual(newBlog)
})