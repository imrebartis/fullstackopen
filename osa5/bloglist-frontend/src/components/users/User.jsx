import { TableCell } from '@mui/material'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const User = ({ user }) => {
  return (
    <>
      <TableCell>
        <Link to={`/users/${user.id}`}>{user.name}</Link>
      </TableCell>
      <TableCell>{user.blogs.length}</TableCell>
    </>
  )
}

User.propTypes = {
  user: PropTypes.object.isRequired
}

export default User
