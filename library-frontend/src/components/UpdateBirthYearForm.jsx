import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { EDIT_AUTHOR_BIRTH_YEAR } from '../queries'

const UpdateBirthYearForm = () => {
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
      <h3>Set birth year</h3>
      <form onSubmit={handleSubmit}>
        <div>
          Name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          Born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">Update Author</button>
      </form>
    </div>
  )
}

export default UpdateBirthYearForm
