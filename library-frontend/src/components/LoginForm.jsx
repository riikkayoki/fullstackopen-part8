import { useState } from 'react'

const LoginForm = ({ show, onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  if (!show) {
    return null
  }

  const submit = (event) => {
    event.preventDefault()
    onLogin({ username, password })
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
