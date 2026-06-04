import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { SetContextLink } from '@apollo/client/link/context'

const authLink = new SetContextLink((prevContext) => {
  const token = localStorage.getItem('library-user-token')
  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  }
})

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_BACKEND_URI ?? 'http://localhost:4000',
})

const client = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
)
