import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  ApolloProvider,
  InMemoryCache,
  ApolloClient,
  createHttpLink
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import App from './App.jsx'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('library-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null
    }
  }
})

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql'
})

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
)
