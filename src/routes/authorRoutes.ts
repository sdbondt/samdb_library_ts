import express from 'express'
import { createAuthor, deleteAuthor, getAuthor, getAuthors } from '../controllers/authorController'
import { bookRouter } from './bookRoutes'
const router = express.Router()

router.use('/:authorId/books', bookRouter)
router.get('/:authorId', getAuthor)
router.get('/', getAuthors)
router.post('/', createAuthor)
router.delete('/:authorId', deleteAuthor)

export { router as authorRouter }