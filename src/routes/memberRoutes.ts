import express from 'express'
import { createMember, deleteMember, getMember, getMembers, updateMember } from '../controllers/memberController'
const router = express.Router()

router.post('/', createMember)
router.get('/:memberId', getMember)
router.get('/', getMembers)
router.patch('/:memberId', updateMember)
router.delete('/:memberId', deleteMember)

export { router as memberRouter }