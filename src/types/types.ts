import { NextFunction, Request, Response } from "express"

type AsyncRequestHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>

enum BookGenreType {
    SCIFI = 'science fiction',
    HORROR = 'horror',
    BIOGRAPHY = 'biography',
    DETECTIVE = 'detective',
    THRILLER = 'thriller',
    CHILDREN = 'children',
    NON_FICTION = 'non-fiction',
    COMICS = 'comic books',
    HISTORY = 'history',
    DRAMA = 'drama',
    MYSTERY = 'mystery',
    CLASSICS = 'classics',
    ROMANCE = 'romance',
    ADVENTURE = 'adventure'
}

type UpdateContactInfoType = {
    email?: string,
    phone?: string
}

type UpdateBookType = {
    total_books?: number,
    genre?: string
}

type QueryBooksType = {
    page?: string,
    limit?: string,
    q?: string
}

export { AsyncRequestHandler, UpdateBookType, BookGenreType, QueryBooksType, UpdateContactInfoType }