import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'

const collectGenres = (books) => {
  const everyGenre = books.flatMap((book) => book.genres)
  const uniqueGenres = [...new Set(everyGenre)]
  return uniqueGenres
}

const filterByGenre = (books, genre) => {
  if (!genre) {
    return books
  }
  return books.filter((book) => book.genres.includes(genre))
}

const Books = ({ show }) => {
  const result = useQuery(ALL_BOOKS)
  const [genre, setGenre] = useState(null)

  if (!show) {
    return null
  }

  if (result.loading) {
    return <div>Loading...</div>
  }

  if (result.error) {
    return <div>Failed to load books: {result.error.message}</div>
  }

  const books = result.data.allBooks

  const genres = collectGenres(books)
  const booksToShow = filterByGenre(books, genre)

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
          {booksToShow.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
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
