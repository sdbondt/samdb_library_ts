import asyncHandler from "../errorhandlers/asyncHandler"
import { Request, Response } from "express"
import StatusCodes from "http-status-codes"
import { validateEmail } from "../utils/validation/validateEmail"
import { ContactInfo } from "../entities/ContactInfoEntity"
import { Member } from "../entities/MemberEntity"
import { UpdateContactInfoType } from "../types/types"
const { OK, BAD_REQUEST, CREATED } = StatusCodes

const createMember = asyncHandler(async (req: Request, res: Response) => {
    const { firstName, lastName, email, phone, } = req.body
    if (!firstName || !lastName || !email) {
        return res.status(BAD_REQUEST).json({
            errorMsg: 'Invalid request.'
        })
    }
    
    const emailIsValid = validateEmail(email)
    if (!emailIsValid) {
        return res.status(BAD_REQUEST).json({
            errorMsg: 'Invalid request: not a valid email.'
        })
    } 

    const contactInfoExists = await ContactInfo.findOne({ where: { email } })
    
    if (contactInfoExists) {
        return res.status(BAD_REQUEST).json({
            errorMsg: 'Member with this email already exists.'
        })
    } else {
        const contactInfo = ContactInfo.create({
            email,
            phone,
        })
    
        const member = Member.create({
            contactInfo,
            first_name: firstName,
            last_name: lastName,
    
        })
        contactInfo.member = member
    
        await member.save()
        await contactInfo.save()
        return res.status(CREATED).json({
            msg: 'User has been created.',
            member
        })
    }    
})

const getMember = asyncHandler(async (req: Request, res: Response) => {
    const { memberId } = req.params
    
    const member = await Member.findOne({
        relations: {
            contactInfo: true,
            loaned_books: true,
            read_books: true,
        },
        where: {
            id: parseInt(memberId)
        }
    })
    if (!member) {
        res.status(BAD_REQUEST).json({
            errorMsg: 'No user found.'
        })
    } else {
        res.status(OK).json({
            msg: 'User has been found.',
            member
        })
    }
})

const getMembers = asyncHandler(async (req: Request, res: Response) => {
    const members = await Member.find()
    res.status(OK).json({
        msg: 'Fetched all members.',
        members
    })
})

const deleteMember = asyncHandler(async (req: Request, res: Response) => {
    const { memberId } = req.params
    const deleteResult = await Member.delete(memberId)
    res.status(OK).json({
        msg: deleteResult
    })
})

const updateMember = asyncHandler(async (req: Request, res: Response) => {
    const { memberId } = req.params
    const { email, phone } = req.body

    if (!email && !phone) {
        return res.status(BAD_REQUEST).json({
            errorMsg: 'Invalid request, you must supply either a email or phone number.'
        })
    }

    if (email) {
        const emailIsValid = validateEmail(email)
        if (!emailIsValid) {
        return res.status(BAD_REQUEST).json({
            errorMsg: 'Invalid request: not a valid email.'
        })
        }
        
        const contactInfoExists = await ContactInfo.findOne({ where: { email } })
        if (contactInfoExists) {
        return res.status(BAD_REQUEST).json({
            errorMsg: 'Email address already in use.'
        })
    }
    }
    
    const body: UpdateContactInfoType = {}
    if (email) {
        body.email = email
    }

    if (phone) {
        body.phone = phone
    }

    const contactInfo = await ContactInfo.findOne({ where: { memberId: parseInt(memberId) } })

    
    if (!contactInfo) {
        return res.status(BAD_REQUEST).json({
            errorMsg: 'Invalid request',
        })
    } else {
        const updatedContactInfo = await ContactInfo.update(contactInfo.id, body)
        return res.status(OK).json({
            msg: 'Updated the contactinfo',
            contactInfo: updatedContactInfo
        })
    }
    
})

export { createMember, updateMember, getMember, getMembers, deleteMember }