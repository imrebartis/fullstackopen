import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { List, ListItem, ListItemText, ListItemIcon } from '@mui/material'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { getUser } from '../../services/users'
import Loading from '../Loading'
import Error from '../Error'

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
        <List>
          {user.blogs.map((blog) => (
            <ListItem key={blog.id}>
              <ListItemIcon>
                <FiberManualRecordIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{blog.title}</ListItemText>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  )
}

export default UserDetails
