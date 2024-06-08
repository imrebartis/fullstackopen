import PropTypes from 'prop-types'

const Message = ({ message, className }) => {
  return <div className={`notification ${className}`}>{message}</div>
}

PropTypes.Message = {
  message: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
}

export default Message
