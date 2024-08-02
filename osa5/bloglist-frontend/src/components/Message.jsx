import PropTypes from 'prop-types'
import { Alert } from '@mui/material'

const Message = ({ message, severity }) => {
  return <Alert severity={severity}>{message}</Alert>
}

Message.propTypes = {
  message: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(['success', 'error']).isRequired
}

export default Message
