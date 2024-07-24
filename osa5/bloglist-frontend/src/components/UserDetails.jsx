import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getUser } from '../services/users'
import Loading from './Loading'
import Error from './Error'

const UserDetails = () => {
  const { id } = useParams()

  const {
    data: user,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id)
  })

  if (isLoading) {
    return <Loading />
  }

  if (isError) {
    return <Error message="incorrect user id" />
  }

  if (!user) {
    return null
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      {user.blogs.length === 0 ? (
        <p>No blogs added yet</p>
      ) : (
        <ul>
          {user.blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default UserDetails
