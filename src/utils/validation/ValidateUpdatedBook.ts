import { BookGenreType } from '../../types/types'

const validateUpdatedBook = async (quantity: number, genre: string) => {
    if (quantity && quantity < 1) {
        return false
    }

    if (genre && !Object.values(BookGenreType).includes(genre as unknown as BookGenreType)) {
        return false
    }

    if (!genre && !quantity) {
        return false
    }

    return true
}

export default validateUpdatedBook