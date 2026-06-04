import { useState } from 'react'
import { useApolloClient, useMutation } from '@apollo/client/react'
import { LOGIN } from '../queries'

const TOKEN_KEY = 'library-user-token'

export const useAuth = (notify, onLoggedIn) => {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY))
  const client = useApolloClient()

  const [loginMutation] = useMutation(LOGIN, {
    onError: (error) => notify?.(`login failed: ${error.message}`),
    onCompleted: (data) => {
      const value = data.login.value
      setToken(value)
      localStorage.setItem(TOKEN_KEY, value)
      onLoggedIn?.()
    },
  })

  const login = (credentials) => loginMutation({ variables: credentials })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return { token, login, logout }
}
