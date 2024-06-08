import PropTypes from 'prop-types'
import Message from './Message'

const Notification = ({ successMessage, errorMessage }) => {
  if (!successMessage && !errorMessage) {
    return null
  }

  return (
    <Message
      className={successMessage ? 'success' : 'error'}
      message={successMessage || errorMessage}
    />
  )
}

PropTypes.Notification = {
  successMessage: PropTypes.string,
  errorMessage: PropTypes.string,
}

export default Notification
