import { useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useNotificationDispatch } from '../NotificationContext'
import { getBlogs } from '../services/blogs'
import Togglable from './Togglable'
import Blog from './Blog'
import BlogForm from './BlogForm'
import Loading from './Loading'
import Error from './Error'

const useBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
    retry: 1,
    refetchOnWindowFocus: false
  })
}

const BlogList = () => {
  const blogFormRef = useRef()
  const queryClient = useQueryClient()
  const dispatch = useNotificationDispatch()

  const { data: blogs, isLoading, isError } = useBlogs()

  return (
    <>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm blogFormRef={blogFormRef} />
      </Togglable>
      {!isLoading &&
        !isError &&
        blogs
          .sort((a, b) => b.likes - a.likes)
          .map((blog) => <Blog key={blog.id} blog={blog} />)}
      {isLoading && <Loading />}
      {isError && (
        <Error message="Fetching the blogs failed. Please try again later." />
      )}
    </>
  )
}

export default BlogList
