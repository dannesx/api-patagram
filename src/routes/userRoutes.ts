import { Router } from 'express'
import {
	deleteUser,
	getUser,
	login,
	newUser,
	updateUser,
} from '../controllers/userController'

const router = Router()

router.get('/:id', getUser)
router.post('/register', newUser)
router.post('/login', login)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router
