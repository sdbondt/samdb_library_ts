import asyncHandler from "../errorhandlers/asyncHandler"
import { Request, Response } from "express"
import StatusCodes from "http-status-codes"
import { Author } from "../entities/AuthorEntity"
import validateNewBook from "../utils/validation/validateNewBook"
import { Book } from "../entities/BookEntity"
import validateUpdatedBook from "../utils/validation/ValidateUpdatedBook"
import { Member } from "../entities/MemberEntity"
import { QueryBooksType } from "src/types/types"
const { OK, BAD_REQUEST, CREATED } = StatusCodes

const createBook = asyncHandler(async (req: Request, res: Response) => {
    const { authorId } = req.params
    const { genre, quantity, title } = req.body

    const validRequest = validateNewBook(title, parseInt(quantity), genre)
    if (!validRequest) {
        return res.status(BAD_REQUEST).json({
            errorMsg: 'Invalid request.'
        })
    }
    
    const author = await Author.findOne({ where: { id: parseInt(authorId)}})
    if (!author) {
        return res.status(BAD_REQUEST).json({
            errorMsg: 'This author does not exist.'
        })
    }

    const bookExists = await Book.findOne({ where: { title }})
    if (bookExists) {
        return res.status(BAD_REQUEST).json({
            errorMsg: 'Book with this title already exists'
        })    
    } else {
        const book = Book.create({
            total_books: parseInt(quantity),
            author,
            genre,
            title,
        })
        await book.save()
        return res.status(CREATED).json({
            msg: 'Book created.',
            book
        })
    }
})

const getBooks = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, }: QueryBooksType = req.query
    const queryLimit = parseInt(limit as string) || 4
    const queryPage = parseInt(page as string) || 1
    const querySkip = (queryPage - 1) * queryLimit

    const [books, total] = await Book.findAndCount({
        relations: {
            author: true,
            loaners: true

        },
        take: queryLimit,
        skip: querySkip,
        
    })
    
    res.status(OK).json({
        msg: 'Fetched all books.',
        books,
        meta: {
            total,
            page: queryPage,
            limit: queryLimit,
        }
    })
})

const getBook = asyncHandler(async (req: Request, res: Response) => {
    const { bookId } = req.params
    
    const book = await Book.findOne({
        relations: {
            author: true,
            loaners: true,
            readers: true
        },
        where:
            { id: parseInt(bookId) }
    })
    if (!book) {
        return res.status(BAD_REQUEST).json({
            errorMsg: 'No book found.'
        })
    } else {
        return res.status(OK).json({
            msg: 'Book found.',
            book
        })
    }
})

const updateBook = asyncHandler(async (req: Request, res: Response) => {
    const { bookId } = req.params
    const { quantity, genre } = req.body

    const isValidRequest = validateUpdatedBook(parseInt(quantity), genre)
    if (!isValidRequest) {
        return res.status(BAD_REQUEST).json({
            errorMsg: 'Invalid update request.'
        })
    }
    // @ts-ignore
    const book = await Book.findOne({ where: { id: parseInt(bookId)}})
    if (!book) {
        return res.status(BAD_REQUEST).json({
            errorMsg: 'No book found.'
        })
    } else {
    if (quantity) {
        book.total_books = parseInt(quantity)
    }

    if (genre) {
        book.genre = genre
    }

    await book.save()
    return res.status(OK).json({
        msg: 'Updated book.',
        book,
    })
    }    
})

const deleteBook = asyncHandler(async (req: Request, res: Response) => {
    const { bookId } = req.params
    const deleteResult = await Book.delete(parseInt(bookId))
    res.status(OK).json({
        msg: deleteResult
    })
})

const loanBook = asyncHandler(async (req: Request, res: Response) => {
    const { bookId, memberId } = req.params
    const book = await Book.findOne({ where: { id: parseInt(bookId) } })
    const member = await Member.findOne({
        relations: { loaned_books: true},
        where: { id: parseInt(memberId) }
    })
    
    if (!book || !member) {
        res.status(BAD_REQUEST).json({
            errorMsg: 'Invalid request.'
        })
    } else if (!book.isAvailable) {
        res.status(BAD_REQUEST).json({
            errorMsg: 'This book is not currently available.'
        })
    } else if (member.loaned_books?.some(b => b.id === parseInt(bookId))) {
        res.status(BAD_REQUEST).json({
            errorMsg: 'Member is already loaning this book.'
        })
    } else {
        member.loaned_books = [...member.loaned_books, book]
        await member.save()
        res.status(OK).json({
            msg: 'Book has been loaned out.',
            member
        })
    }
})

const returnBook = asyncHandler(async (req: Request, res: Response) => {
    const { bookId, memberId } = req.params
    const book = await Book.findOne({ where: { id: parseInt(bookId) } })
    const member = await Member.findOne({
        relations: { loaned_books: true, read_books: true },
        where: { id: parseInt(memberId) }
    })

    if (!book || !member) {
        res.status(BAD_REQUEST).json({
            errorMsg: 'Invalid request.'
        })
    } else if (!member.loaned_books?.some(b => b.id === parseInt(bookId))) {
        res.status(BAD_REQUEST).json({
            errorMsg: 'Member has not been loaning this book.'
        })
    } else {
        member.loaned_books = member.loaned_books.filter(b => b.id !== parseInt(bookId))
        if (!member.read_books?.some(b => b.id === parseInt(bookId))) {
            member.read_books = [...member.read_books, book]
        }
        member.save()
        res.status(OK).json({
            msg: 'Book has been returned.',
            member
        })
    }
})



export { createBook, getBook, getBooks, updateBook, deleteBook, loanBook, returnBook }