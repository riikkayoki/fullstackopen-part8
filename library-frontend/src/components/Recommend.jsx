import { useEffect } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ME } from '../queries'

const filterByGenre = (books, genre) =>
  books.filter((book) => book.genres.includes(genre))

const Recommend = ({ show }) => {
  const myInfoResult = useQuery(ME)
  const allBooksResult = useQuery(ALL_BOOKS)
  const { refetch: refetchMyInfo } = myInfoResult

  useEffect(() => {
    if (show) {
      refetchMyInfo()
    }
  }, [show, refetchMyInfo])

  if (!show) {
    return null
  }

  if (myInfoResult.loading || allBooksResult.loading) {
    return <div>Loading...</div>
  }

  if (myInfoResult.error) {
    return <div>Failed to load user: {myInfoResult.error.message}</div>
  }

  if (allBooksResult.error) {
    return <div>Failed to load books: {allBooksResult.error.message}</div>
  }

  const favoriteGenre = myInfoResult.data.me?.favoriteGenre
  const recommendedBooks = filterByGenre(
    allBooksResult.data.allBooks,
    favoriteGenre
  )

  return (
    <div>
      <h2>Recommendations</h2>

      <p>
        Books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
