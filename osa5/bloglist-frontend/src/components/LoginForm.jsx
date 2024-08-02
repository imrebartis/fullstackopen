import PropTypes from 'prop-types'
import { useLoginValue, useLoginDispatch } from '../LoginContext'
import { TextField, Button } from '@mui/material'

const LoginForm = ({ handleLogin }) => {
  const { username, password } = useLoginValue()
  const { setUsername, setPassword } = useLoginDispatch()

  return (
    <form onSubmit={handleLogin}>
      <div>
        <TextField
          label="Username"
          type="text"
          data-testid="username"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
          variant="outlined"
          margin="normal"
        />
      </div>
      <div>
        <TextField
          label="Password"
          type="password"
          data-testid="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
          variant="outlined"
          margin="normal"
        />
      </div>
      <Button variant="contained" color="primary" type="submit">
        log in
      </Button>
    </form>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm
