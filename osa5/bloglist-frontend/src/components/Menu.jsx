import { Link } from 'react-router-dom'

const Menu = ({ user, handleLogout }) => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div style={{ background: '#C0C0C0', padding: '8px 4px' }}>
      <Link to="/" style={padding}>
        blogs
      </Link>
      <Link to="/users" style={padding}>
        users
      </Link>
      {user.name} logged in <button onClick={handleLogout}>logout</button>
    </div>
  )
}

export default Menu
