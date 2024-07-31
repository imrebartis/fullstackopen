import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it as it, expect, beforeEach } from 'vitest'
import {
  MemoryRouter,
  Route,
  Routes,
  BrowserRouter as Router
} from 'react-router-dom'
import {
  QueryClient,
  QueryClientProvider,
  useMutation
} from '@tanstack/react-query'
import BlogDetails from './BlogDetails'
import Blog from './Blog'
import BlogForm from './BlogForm'
import { getBlog } from '../../services/blogs'
import { getUsers } from '../../services/users'
import useHandleLike from '../../hooks/useHandleLike'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ id: '1' }),
    useNavigate: () => vi.fn()
  }
})

vi.mock('../../services/blogs', () => ({
  getBlog: vi.fn(),
  removeBlog: vi.fn(),
  createBlog: vi.fn()
}))

vi.mock('../../services/users', () => ({
  getUsers: vi.fn()
}))

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query')
  return {
    ...actual,
    useMutation: vi.fn()
  }
})

vi.mock('../../NotificationContext', () => ({
  useNotificationDispatch: vi.fn(),
  NotificationContextProvider: ({ children }) => children
}))

vi.mock('../../hooks/useHandleLike', () => ({
  default: vi.fn()
}))

const mockBlog = {
  id: '1',
  title: 'Test Blog',
  url: 'https://testblog.com',
  likes: 10,
  user: 'user1',
  author: 'John Doe'
}

const mockUsers = [{ id: 'user1', name: 'John Doe' }]

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  })

let queryClient

describe('BlogDetails', () => {
  beforeEach(() => {
    vi.mocked(getBlog).mockResolvedValue(mockBlog)
    vi.mocked(getUsers).mockResolvedValue(mockUsers)
    vi.mocked(useHandleLike).mockReturnValue(vi.fn())
    vi.mocked(useMutation).mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
      isError: false,
      error: null
    })
  })

  const renderBlogDetails = (loggedInUser = null) => {
    return render(
      <QueryClientProvider client={createTestQueryClient()}>
        <MemoryRouter initialEntries={['/blogs/1']}>
          <Routes>
            <Route
              path="/blogs/:id"
              element={<BlogDetails loggedInUser={loggedInUser} />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  it('BlogDetails shows correct user name', async () => {
    renderBlogDetails()
    const userNameElement = await screen.findByText(/added by John Doe/)
    expect(userNameElement).toBeInTheDocument()
  })

  it('BlogDetails shows correct number of likes', async () => {
    renderBlogDetails()
    const likesElement = await screen.findByText(/10 likes/)
    expect(likesElement).toBeInTheDocument()
  })

  it('BlogDetails calls handleLike when like button is clicked', async () => {
    const user = userEvent.setup()
    const handleLikeMock = vi.fn()
    vi.mocked(useHandleLike).mockReturnValue(handleLikeMock)

    renderBlogDetails()

    const likeButton = await screen.findByText('like')
    await user.click(likeButton)

    expect(handleLikeMock).toHaveBeenCalledWith(mockBlog)
  })
})

describe('<Blog />', () => {
  it('Blog renders blog title and author', async () => {
    const blog = {
      id: '1',
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testblog.com',
      likes: 5,
      user: '1'
    }

    render(
      <Router>
        <Blog blog={blog} />
      </Router>
    )

    const blogElement = screen.getByText(`${blog.title} ${blog.author}`)
    expect(blogElement).toBeInTheDocument()
  })

  it('Clicking the blog title navigates to blog details', async () => {
    const blog = {
      id: '1',
      title: 'Test Blog',
      author: 'Test Author',
      url: 'http://testblog.com',
      likes: 5,
      user: '1'
    }

    render(
      <Router>
        <Blog blog={blog} />
      </Router>
    )

    const titleElement = screen.getByText(`${blog.title} ${blog.author}`)
    expect(titleElement).toHaveAttribute('href', `/blogs/${blog.id}`)
  })
})

describe('<BlogForm />', () => {
  it('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const user = userEvent.setup()
    const mockMutate = vi.fn()
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isLoading: false,
      isError: false,
      error: null
    })

    const mockToggleVisibility = vi.fn()
    const blogFormRef = { current: { toggleVisibility: mockToggleVisibility } }

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <BlogForm visible={true} blogFormRef={blogFormRef} />
      </QueryClientProvider>
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
})
