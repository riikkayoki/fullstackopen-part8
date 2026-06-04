import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { EDIT_AUTHOR_BIRTH_YEAR } from '../queries'

const UpdateBirthYearForm = ({ authors }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [editAuthorBirthYear] = useMutation(EDIT_AUTHOR_BIRTH_YEAR)

  const handleSubmit = (event) => {
    event.preventDefault()

    editAuthorBirthYear({ variables: { name, setBornTo: Number(born) } })
      .then(() => {
        setName('')
        setBorn('')
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={handleSubmit}>
        <div>
          Name
          <select
            name="name"
            value={name}
            onChange={({ target }) => setName(target.value)}
          >
            <option value="" disabled>
              -- Select Author --
            </option>
            {authors.map((author) => (
              <option key={author.id} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>
            born
            <input
              type="number"
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
          </label>
        </div>
        <button type="submit">Update Author</button>
      </form>
    </div>
  )
}

export default UpdateBirthYearForm
