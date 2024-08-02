import { Link } from 'react-router-dom'
import { AppBar, Toolbar, Button } from '@mui/material'

const Menu = ({ user, handleLogout }) => {
  const padding = {
    paddingRight: 5
  }
  const buttonStyle = {
    '&:hover': {
      backgroundColor: 'transparent',
      textDecoration: 'underline'
    }
  }
  const appBarStyle = {
    backgroundColor: '#C0C0C0',
    color: 'black',
    fontWeight: 'bold',
    boxShadow: 'none'
  }

  return (
    <AppBar position="static" sx={appBarStyle}>
      <Toolbar>
        <Button
          color="inherit"
          component={Link}
          to="/"
          style={padding}
          sx={buttonStyle}
        >
          blogs
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/users"
          style={padding}
          sx={buttonStyle}
        >
          users
        </Button>
        {user.name} logged in{' '}
        <Button color="inherit" onClick={handleLogout} sx={buttonStyle}>
          logout
        </Button>
      </Toolbar>
    </AppBar>
  )
}

export default Menu
