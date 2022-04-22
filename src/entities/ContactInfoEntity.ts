import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import { Member } from "./MemberEntity"

@Entity('conctactInfo')
export class ContactInfo extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        unique: true,
    })
    email: string

    @Column({
        nullable: true
    })
    phone: string

    @Column({ name: 'member_id' })
    memberId: number

    @OneToOne(
        () => Member,
        member => member.contactInfo,
        { onDelete: 'CASCADE'}
    )
    @JoinColumn({
        name: 'member_id'
    })
    member: Member
}