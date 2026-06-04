import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const collectGenres = (books) => {
  const everyGenre = books.flatMap((book) => book.genres)
  const uniqueGenres = [...new Set(everyGenre)]
  return uniqueGenres
}

const Books = ({ show }) => {
  const [genre, setGenre] = useState(null)
  const allBooksResult = useQuery(ALL_BOOKS)
  const booksInGenreResult = useQuery(ALL_BOOKS, { variables: { genre } })

  if (!show) {
    return null
  }

  if (allBooksResult.loading) {
    return <div>Loading...</div>
  }

  if (allBooksResult.error) {
    return <div>Failed to load books: {allBooksResult.error.message}</div>
  }

  const genres = collectGenres(allBooksResult.data.allBooks)
  const booksToShow = booksInGenreResult.data?.allBooks ?? []

  return (
    <div>
      <h2>books</h2>

      {genre && (
        <p>
          in genre <strong>{genre}</strong>
        </p>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}
        <button onClick={() => setGenre(null)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
