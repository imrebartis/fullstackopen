const Notify = ({ errorMessage, successMessage }) => {
  if (!errorMessage && !successMessage) {
    return null
  }

  return (
    <div style={{ color: errorMessage ? 'red' : 'green' }}>
      {errorMessage || successMessage}
    </div>
  )
}

export default Notify
