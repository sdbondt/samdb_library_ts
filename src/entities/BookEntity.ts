import { BookGenreType } from "../types/types"
import { BaseEntity, Check, Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Author } from "./AuthorEntity"
import { Member } from "./MemberEntity"



// indien je makkelijk wilt queryen op loaned-out-books: eigen entity maken (bv zoals transaction) ipv een many to many relationship
@Entity('book')
@Check(`"total_books" >= 0`)
export class Book extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true
    })
    title: string

    @Column({
        type: 'enum',
        enum: BookGenreType
    })
    genre: string

    @Column()
    total_books: number

    @Column({ name: 'author_id' })
    authorId: number

    @ManyToOne(
        () => Author,
        author => author.books,
        { onDelete: 'SET NULL'}
    )
    @JoinColumn({
        name: 'author_id'
    })
    author: Author

    @ManyToMany(
        () => Member,
        member => member.loaned_books
    )
    loaners: Member[]

    @ManyToMany(
        () => Member,
        member => member.read_books
    )
    readers: Member[]

    get loaned_out_books(): number {
        return this.loaners?.length || 0
    }
        
    get available_books(): number {
        return this.total_books - this.loaned_out_books
    }

    get isAvailable(): boolean {
        return this.available_books > 0 ? true:false
    }

    get isLoanedOut(): boolean {
        return this.loaned_out_books > 0 ? true: false
    }

}
