import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { useAuth } from './hooks/useAuth'
import { useNotification } from './hooks/useNotification'

const App = () => {
  const [page, setPage] = useState('authors')
  const { message, notify } = useNotification()
  const { token, login, logout } = useAuth(notify, () => setPage('authors'))

  const handleLogout = () => {
    logout()
    setPage('authors')
  }

  const notification = message ? (
    <div style={{ color: 'red' }}>{message}</div>
  ) : null

  return (
    <div>
      {notification}
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={handleLogout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage('login')}>login</button>
        )}
      </div>

      <Authors show={page === 'authors'} loggedIn={Boolean(token)} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <LoginForm show={page === 'login'} onLogin={login} />
    </div>
  )
}

export default App
