import React from 'react'
import PropTypes from 'prop-types'

const Error = ({ value }) => {
  return (
    <div className="error">
      <p>Error: {value}</p>
    </div>
  )
}

Error.propTypes = {
  value: PropTypes.string.isRequired
}

export default Error
