import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const User = ({ user }) => {
  return (
    <tr>
      <td>
        <Link to={`/users/${user.id}`}>{user.name}</Link>
      </td>
      <td>{user.blogs.length}</td>
    </tr>
  )
}

User.propTypes = {
  user: PropTypes.object.isRequired
}

export default User
