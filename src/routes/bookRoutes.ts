import express from 'express'
import { createBook, getBook, updateBook, deleteBook, getBooks, loanBook, returnBook,  } from '../controllers/bookController'
const router = express.Router({ mergeParams: true })

router.post('/', createBook)
router.get('/:bookId', getBook)
router.get('/', getBooks)
router.delete('/:bookId', deleteBook)
router.patch('/:bookId', updateBook)
router.post('/:bookId/loan/:memberId', loanBook)
router.post('/:bookId/return/:memberId', returnBook)


export { router as bookRouter }