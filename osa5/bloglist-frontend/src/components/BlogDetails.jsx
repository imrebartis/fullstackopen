import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getBlog } from '../services/blogs'
import { getUsers } from '../services/users'
import Loading from './Loading'
import Error from './Error'
import useHandleLike from '../hooks/useHandleLike'

const BlogDetails = () => {
  const { id } = useParams()
  const handleLike = useHandleLike()

  const {
    data: blog,
    isLoading: isBlogLoading,
    isError: isBlogError
  } = useQuery({
    queryKey: ['blog', id],
    queryFn: () => getBlog(id)
  })

  const {
    data: users,
    isLoading: isUsersLoading,
    isError: isUsersError
  } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  })

  if (isBlogLoading || isUsersLoading) {
    return <Loading />
  }

  if (isBlogError || isUsersError) {
    return <Error message="Error fetching data" />
  }

  if (!blog || !users) {
    return null
  }

  const user = users.find((user) => user.id === blog.user)

  return (
    <>
      <h2>{blog.title}</h2>
      <p>
        <a href={blog.url} target="_blank" rel="noopener noreferrer">
          {blog.url}
        </a>
      </p>
      <p>
        {blog.likes} likes{' '}
        <button onClick={() => handleLike(blog)}>like</button>
      </p>
      <p>added by {user ? user.name : 'Unknown'}</p>
    </>
  )
}

export default BlogDetails
