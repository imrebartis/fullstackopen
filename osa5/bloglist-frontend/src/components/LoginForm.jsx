import PropTypes from 'prop-types'
import { useLoginValue, useLoginDispatch } from '../LoginContext'

const LoginForm = ({ handleLogin }) => {
  const { username, password } = useLoginValue()
  const { setUsername, setPassword } = useLoginDispatch()

  return (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          data-testid="username"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
          style={{ marginLeft: '8px', marginBottom: '8px' }}
        />
      </div>
      <div>
        password
        <input
          type="password"
          data-testid="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
          style={{ marginLeft: '8px', marginBottom: '8px' }}
        />
      </div>
      <button type="submit">log in</button>
    </form>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired
}

export default LoginForm
