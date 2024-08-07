import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  ApolloProvider,
  InMemoryCache,
  ApolloClient,
  HttpLink
} from '@apollo/client'
import App from './App.jsx'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql'
  })
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
)
