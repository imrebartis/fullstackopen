import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { expect, test, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router } from 'react-router-dom'
import { NotificationContextProvider } from '../NotificationContext'
import { getBlog, getBlogs } from '../services/blogs'
import { getUsers } from '../services/users'
import BlogDetails from './BlogDetails'
import BlogsList from './BlogsList'
import BlogForm from './BlogForm'
import Blog from './Blog'

vi.mock('../services/blogs', () => ({
  getBlog: vi.fn(),
  updateBlog: vi.fn(),
  getBlogs: vi.fn(),
  createBlog: vi.fn()
}))

vi.mock('../services/users', () => ({
  getUsers: vi.fn()
}))

vi.mock('../hooks/useHandleLike', () => ({
  default: () => vi.fn()
}))

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    useMutation: vi.fn()
  }
})

const queryClient = new QueryClient()

const renderWithProviders = (ui, { route = '/' } = {}) => {
  return render(
    <NotificationContextProvider>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/" element={<BlogsList />} />
            <Route
              path="/blogs/:id"
              element={<BlogDetails loggedInUser={{ id: '1' }} />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </NotificationContextProvider>
  )
}

const setupBlogsList = (blogs) => {
  getBlogs.mockResolvedValue(blogs)

  renderWithProviders(<BlogsList />)
}

const setupBlogDetails = (blog, users) => {
  getBlog.mockResolvedValue(blog)
  getUsers.mockResolvedValue(users)

  renderWithProviders(<BlogDetails loggedInUser={{ id: '1' }} />, {
    route: `/blogs/${blog.id}`
  })
}

test('renders blog title and author', async () => {
  const blogs = [
    {
      id: '1',
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testblog.com',
      likes: 5,
      user: '1'
    }
  ]

  setupBlogsList(blogs)

  await waitFor(() => {
    expect(screen.getByText('Test Blog Test Author')).toBeInTheDocument()
  })
})

test('clicking the blog title navigates to blog details and shows url', async () => {
  const blog = {
    id: '1',
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 5,
    user: '1'
  }

  const renderBlog = () => {
    render(
      <Router>
        <Blog blog={blog} />
      </Router>
    )
  }

  renderBlog()

  const titleElement = screen.getByText(`${blog.title} ${blog.author}`)
  await userEvent.click(titleElement)

  const urlElement = screen.getByRole('link', {
    name: `${blog.title} ${blog.author}`
  })

  expect(urlElement).toBeInTheDocument()
  expect(urlElement).toHaveAttribute('href', `/blogs/${blog.id}`)
})

test('blog details shows correct user name', async () => {
  const blog = {
    id: '1',
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 5,
    user: '1'
  }

  const users = [{ id: '1', name: 'Test User' }]

  setupBlogDetails(blog, users)

  await waitFor(() => {
    expect(screen.getByText('added by Test User')).toBeInTheDocument()
  })
})

test('blog details shows correct number of likes', async () => {
  const blog = {
    id: '1',
    title: 'Test Blog',
    author: 'Test Author',
    url: 'http://testblog.com',
    likes: 5,
    user: '1'
  }

  const users = [{ id: '1', name: 'Test User' }]

  setupBlogDetails(blog, users)

  await waitFor(() => {
    expect(screen.getByText('5 likes')).toBeInTheDocument()
  })
})

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const mockMutate = vi.fn()

  const { useMutation } = await import('@tanstack/react-query')
  useMutation.mockReturnValue({
    mutate: mockMutate
  })

  const mockToggleVisibility = vi.fn()
  const blogFormRef = { current: { toggleVisibility: mockToggleVisibility } }

  render(
    <NotificationContextProvider>
      <QueryClientProvider client={queryClient}>
        <BlogForm visible={true} blogFormRef={blogFormRef} />
      </QueryClientProvider>
    </NotificationContextProvider>
  )

  const titleInput = screen.getByTestId('title')
  const authorInput = screen.getByTestId('author')
  const urlInput = screen.getByTestId('url')
  const createButton = screen.getByTestId('create-button')

  await user.type(titleInput, 'test title')
  await user.type(authorInput, 'test author')
  await user.type(urlInput, 'test url')
  await user.click(createButton)

  expect(mockMutate).toHaveBeenCalledWith({
    title: 'test title',
    author: 'test author',
    url: 'test url'
  })

  expect(mockToggleVisibility).toHaveBeenCalled()
})
