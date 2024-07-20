import PropTypes from 'prop-types'
import Message from './Message'

const Notification = ({ message }) => {
  if (!message) {
    return null
  }

  const className =
    message.type === 'SET_SUCCESS_NOTIFICATION' ? 'success' : 'error'

  return <Message className={className} message={message.payload} />
}

Notification.propTypes = {
  message: PropTypes.shape({
    type: PropTypes.string.isRequired,
    payload: PropTypes.string.isRequired
  })
}

export default Notification
