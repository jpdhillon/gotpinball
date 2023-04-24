import React from 'react'
import styles from '@/styles/Pagination.module.css'

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = []

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i)
  }

  const startIndex = Math.max(0, currentPage - 3)
  const endIndex = Math.min(startIndex + 5, pageNumbers.length)
  const visiblePageNumbers = pageNumbers.slice(startIndex, endIndex)

  return (
    <nav className={styles.pagination}>
      <ul className={styles.paginationList}>
        <li>
          <button
            className={styles.paginationButton}
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>
        {visiblePageNumbers.map((number) => (
          <li key={number} className={styles.paginationItem}>
            <button
              className={`${styles.paginationButton} ${
                number === currentPage ? styles.active : ''
              }`}
              onClick={() => paginate(number)}
            >
              {number}
            </button>
          </li>
        ))}
        <li>
          <button
            className={styles.paginationButton}
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === pageNumbers.length}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination
