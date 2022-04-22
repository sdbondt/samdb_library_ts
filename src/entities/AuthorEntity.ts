import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Book } from "./BookEntity"

@Entity('author')
export class Author extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    first_name: string

    @Column()
    last_name: string

    @OneToMany(
        () => Book,
        book => book.author
    )
    books: Book[]

    get fullName(): string {
        return `${this.first_name} ${this.last_name}`
    }


}