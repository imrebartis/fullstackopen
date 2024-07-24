import PropTypes from 'prop-types'

const User = ({ user }) => {
  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.blogs.length}</td>
    </tr>
  )
}

User.propTypes = {
  user: PropTypes.object.isRequired
}

export default User
