import asyncHandler from "../errorhandlers/asyncHandler"
import { Request, Response } from "express"
import StatusCodes from "http-status-codes"
import { Author } from "../entities/AuthorEntity"
const { OK, BAD_REQUEST, CREATED } = StatusCodes

const createAuthor = asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName } = req.body
    if (!firstName || !lastName) {
        res.status(BAD_REQUEST).json({
            errorMsg: 'Invalid request, author must have a first and last name.'
        })
    } else {
        const author = Author.create({
            first_name: firstName,
            last_name: lastName
        })
        await author.save()
        res.status(CREATED).json({
            msg: 'Author got created.',
            author
        })
    }
})

const getAuthor = asyncHandler(async (req: Request, res: Response) => {
    const { authorId } = req.params

    const author = await Author.findOne(
        {
            relations: {
                books: true,
            },
            where: {
                id: parseInt(authorId)
            }
        }
    )
    if (!author) {
        res.status(BAD_REQUEST).json({
            errorMsg: 'No author found.'
        })
    } else {
        res.status(OK).json({
            author,
            msg: 'Author found'
        })
    }
})

const getAuthors = asyncHandler(async (req: Request, res: Response) => {
    const authors = await Author.find({
        relations: {
            books: true
        }
    })
    res.status(OK).json({
        msg: 'Authors found.',
        authors
    })
})


const deleteAuthor = asyncHandler(async (req: Request, res: Response) => {
    const { authorId } = req.params
    const deleteResult = await Author.delete(authorId)
    res.status(OK).json({
        msg: deleteResult
    })
})

export { createAuthor, deleteAuthor, getAuthor, getAuthors }