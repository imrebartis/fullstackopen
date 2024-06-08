import { render } from '@testing-library/react'
import Blog from './Blog'
import { expect } from 'vitest'

test('renders content', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    url: 'http://www.blog1.com',
    user: {
      name: 'Test User',
    },
  }

  const handleLike = () => {}

  const handleRemove = () => {}

  const loggedInUser = {
    id: '1',
  }

  const { getByTestId } = render(
    <Blog
      blog={blog}
      handleLike={handleLike}
      handleRemove={handleRemove}
      loggedInUser={loggedInUser}
    />
  )

  const div = getByTestId('blog')
  expect(div).toHaveTextContent(
    'Component testing is done with react-testing-library'
  )
})
