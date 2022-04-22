import { Book } from "../../entities/BookEntity"
import { BookGenreType } from '../../types/types'

const validateNewBook = async (title: string, quantity: number, genre: string) => {
    const titleExists = await Book.findOne({ where: { title } })
    if (titleExists) {
        return false
    }

    if (quantity < 1) {
        return false
    }

    if (!Object.values(BookGenreType).includes(genre as unknown as BookGenreType)) {
        return false
    }

    return true
}

export default validateNewBook