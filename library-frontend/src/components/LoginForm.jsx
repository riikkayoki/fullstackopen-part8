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
          <label>
            username
            <input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
