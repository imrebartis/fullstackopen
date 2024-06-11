import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'
import { expect } from 'vitest'

const setup = () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    url: 'http://www.blog1.com',
    user: {
      name: 'Test User',
    },
    likes: 7,
  }

  const handleLike = vi.fn()
  const handleRemove = vi.fn()
  const loggedInUser = { id: '1' }

  const utils = render(
    <Blog
      blog={blog}
      handleLike={handleLike}
      handleRemove={handleRemove}
      loggedInUser={loggedInUser}
    />
  )

  const div = utils.getByTestId('blog')

  return {
    ...utils,
    div,
    blog,
    handleLike,
    handleRemove,
    loggedInUser,
  }
}

test('renders content', () => {
  const { div } = setup()
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
})

test('clicking the visibility button results in displaying the blog url', async () => {
  const { div, getByTestId } = setup()

  const user = userEvent.setup()
  const button = div.querySelector('.visibility-button')
  await user.click(button)

  const urlElement = getByTestId('blog-url')
  expect(urlElement).toHaveTextContent('http://www.blog1.com')
})

test('clicking the visibility button results in displaying the name of the user', async () => {
  const { div, getByTestId } = setup()

  const user = userEvent.setup()
  const button = div.querySelector('.visibility-button')
  await user.click(button)

  const usernameElement = getByTestId('blog-username')
  expect(usernameElement).toHaveTextContent('Test User')
})

test('clicking the visibility button results in displaying the number of likes', async () => {
  const { div, getByTestId } = setup()

  const user = userEvent.setup()
  const button = div.querySelector('.visibility-button')
  await user.click(button)

  const likesElement = getByTestId('blog-likes')
  expect(likesElement).toHaveTextContent('likes 7')
})

test('clicking twice the like button calls event handler twice', async () => {
  const { div, getByTestId, handleLike } = setup()

  const user = userEvent.setup()
  const visibilityButton = div.querySelector('.visibility-button')
  await user.click(visibilityButton)

  const likeButton = getByTestId('like-button')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(handleLike.mock.calls).toHaveLength(2)
})

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  const { container, getByTestId } = render(
    <BlogForm createBlog={createBlog} />
  )

  const titleInput = container.querySelector('#title')
  const authorInput = container.querySelector('#author')
  const urlInput = container.querySelector('#url')
  const sendButton = getByTestId('send-button')

  await user.type(titleInput, 'test title')
  await user.type(authorInput, 'test author')
  await user.type(urlInput, 'test url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('test title')
  expect(createBlog.mock.calls[0][0].author).toBe('test author')
  expect(createBlog.mock.calls[0][0].url).toBe('test url')
})
