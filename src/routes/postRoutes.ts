import { Router } from 'express'
import { authenticateToken } from '../middlewares/auth'
import {
	getPosts,
	getPostById,
	createPost,
	updatePost,
	deletePost,
	likePost,
} from '../controllers/postController'

const router = Router()

router.get('/', getPosts)
router.get('/:id', getPostById)
router.post('/', authenticateToken, createPost)
router.put('/:id', authenticateToken, updatePost)
router.delete('/:id', authenticateToken, deletePost)
router.post('/:id/like', authenticateToken, likePost)

export default router
