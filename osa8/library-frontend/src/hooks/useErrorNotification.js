import { useEffect, useState } from 'react'

const useErrorNotification = (result) => {
  const [errorMessage, setErrorMessage] = useState(null)

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  useEffect(() => {
    if (result.error) {
      console.log('error', result.error)
      const errorMessage = result.error.message || 'An error occurred'
      notify(errorMessage)
    }
  }, [result.error])

  return errorMessage
}

export default useErrorNotification
