import { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TableContainer, Paper, Table, TableBody } from '@mui/material'
import { getBlogs } from '../../services/blogs'
import Togglable from '../Togglable'
import Blog from './Blog'
import BlogForm from './BlogForm'
import Loading from '../Loading'
import Error from '../Error'

const useBlogs = () => {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: getBlogs,
    retry: 1,
    refetchOnWindowFocus: false
  })
}

const BlogsList = () => {
  const blogFormRef = useRef()

  const { data: blogs, isLoading, isError } = useBlogs()

  return (
    <>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm blogFormRef={blogFormRef} />
      </Togglable>
      {!isLoading && !isError && blogs.length === 0 && (
        <p>No blogs added yet</p>
      )}
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {!isLoading &&
              !isError &&
              blogs.length > 0 &&
              blogs
                .sort((a, b) => b.likes - a.likes)
                .map((blog) => <Blog key={blog.id} blog={blog} />)}
          </TableBody>
        </Table>
      </TableContainer>
      {isLoading && <Loading />}
      {isError && (
        <Error message="Fetching the blogs failed. Please try again later." />
      )}
    </>
  )
}

export default BlogsList
