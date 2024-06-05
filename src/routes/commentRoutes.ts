import { Router } from 'express'
import { authenticateToken } from '../middlewares/auth'
import {
	createComment,
	updateComment,
	deleteComment,
} from '../controllers/commentController'

const router = Router()

router.post('/:postId', authenticateToken, createComment)
router.put('/:id', authenticateToken, updateComment)
router.delete('/:id', authenticateToken, deleteComment)

export default router
