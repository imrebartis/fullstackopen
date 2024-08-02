import PropTypes from 'prop-types'
import Message from './Message'

const Notification = ({ message }) => {
  if (!message) {
    return null
  }

  const severity =
    message.type === 'SET_SUCCESS_NOTIFICATION' ? 'success' : 'error'

  return <Message message={message.payload} severity={severity} />
}

Notification.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.string.isRequired,
    payload: PropTypes.string.isRequired
  })
}

export default Notification
