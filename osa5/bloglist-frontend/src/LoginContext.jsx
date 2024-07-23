import { createContext, useReducer, useContext, useCallback } from 'react'

const initialState = {
  username: '',
  password: '',
  user: null
}

const loginReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USERNAME':
      return { ...state, username: action.username }
    case 'SET_PASSWORD':
      return { ...state, password: action.password }
    case 'SET_USER':
      return { ...state, user: action.user }
    default:
      return state
  }
}

const LoginContext = createContext()

export const LoginContextProvider = ({ children }) => {
  const [login, loginDispatch] = useReducer(loginReducer, initialState)

  return (
    <LoginContext.Provider value={[login, loginDispatch]}>
      {children}
    </LoginContext.Provider>
  )
}

export const useLoginValue = () => {
  const [login] = useContext(LoginContext)
  return login
}

export const useLoginDispatch = () => {
  const [, loginDispatch] = useContext(LoginContext)

  const setUsername = useCallback(
    (username) => {
      loginDispatch({ type: 'SET_USERNAME', username })
    },
    [loginDispatch]
  )

  const setPassword = useCallback(
    (password) => {
      loginDispatch({ type: 'SET_PASSWORD', password })
    },
    [loginDispatch]
  )

  const setUser = useCallback(
    (user) => {
      loginDispatch({ type: 'SET_USER', user })
    },
    [loginDispatch]
  )

  return { setUsername, setPassword, setUser }
}

export default LoginContextProvider
