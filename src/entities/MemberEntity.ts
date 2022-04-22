import { BaseEntity, Column, Entity, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Book } from "./BookEntity"
import { ContactInfo } from "./ContactInfoEntity"


@Entity('member')
export class Member extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    first_name: string

    @Column()
    last_name: string

    
    @OneToOne(
        () => ContactInfo,
        contactInfo => contactInfo.member
    )
    contactInfo: ContactInfo

    @ManyToMany(
        () => Book,
        book => book.loaners,
        { cascade: true }
    )
    @JoinTable({
        name: 'loaned_out_books',
    })
    loaned_books: Book[]

    @ManyToMany(
        () => Book,
        book => book.readers
    )
    @JoinTable({
        name: 'read_books_by_member'
    })
    read_books: Book[]


    get fullName(): string {
        return `${this.first_name} ${this.last_name}`
    }

    get bookCount(): number {
        return this.read_books.length 
    }

}