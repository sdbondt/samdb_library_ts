import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import morgan from 'morgan'
import { createConnection } from 'typeorm'
import notFoundHandler from './errorhandlers/notFoundHandler'
import errorHandler from './errorhandlers/errorHandler'
import { memberRouter } from './routes/memberRoutes'
import { authorRouter } from './routes/authorRoutes'
import { bookRouter } from './routes/bookRoutes'
import { Member } from './entities/MemberEntity'
import { ContactInfo } from './entities/ContactInfoEntity'
import { Book } from './entities/BookEntity'
import { Author } from './entities/AuthorEntity'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

const main = async () => {
    try {
        await createConnection({
			type: 'postgres',
			host: process.env.PG_HOST,
			port: 5432,
			username: process.env.PG_USER,
			password: process.env.PG_PASSWORD,
			database: process.env.PG_DB,
            synchronize: true,
            entities: [Member, ContactInfo, Book, Author]
        })
        
        console.log('Connected to Postgres.')

        app.use(express.json())
        app.use(cors())
        app.use(morgan('dev'))

        app.use('/members', memberRouter)
        app.use('/authors', authorRouter)
        app.use('/books', bookRouter)

        app.use(notFoundHandler)
        app.use(errorHandler)

        app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}.`);
		})
    } catch (e) {
        console.error(e)
		throw new Error('Unable to connect to db')
    }
}

main()