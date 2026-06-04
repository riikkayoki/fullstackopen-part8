import { useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_AUTHORS } from '../queries'
import UpdateBirthYearForm from './UpdateBirthYearForm'

const Authors = ({ show, loggedIn }) => {
  const result = useQuery(ALL_AUTHORS)
  const { refetch } = result

  useEffect(() => {
    if (show) {
      refetch()
    }
  }, [show, refetch])

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>Loading...</div>
  }

  if (result.error) {
    return <div>Failed to load authors: {result.error.message}</div>
  }

  const authors = result.data.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {loggedIn && <UpdateBirthYearForm authors={authors} />}
    </div>
  )
}

export default Authors
