import { Router } from 'express'
import {
	deleteUser,
	getUser,
	login,
	newUser,
	updateUser,
} from '../controllers/userController'
import { authenticateToken } from '../middlewares/auth'

const router = Router()

router.post('/register', newUser)
router.post('/login', login)

router.get('/:id', authenticateToken, getUser)
router.put('/:id', authenticateToken, updateUser)
router.delete('/:id', authenticateToken, deleteUser)

export default router
