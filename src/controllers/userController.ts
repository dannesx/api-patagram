import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from '../config/prismaConfig'
import { Prisma } from '@prisma/client'

export const getUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params

	try {
		const user = await prisma.user.findUnique({
			where: { id },
		})

		if (user) {
			res.json(user)
		} else {
			res.status(404).json({ error: 'User not found' })
		}
	} catch (error) {
		next(error)
	}
}

export const newUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { username, email, password } = req.body

	if (!username || !email || !password) {
		return res
			.status(400)
			.json({ error: 'Username, email and password are required' })
	}
	try {
		const hashedPassword = await bcrypt.hash(password, 10)
		const user = await prisma.user.create({
			data: {
				username,
				email,
				password: hashedPassword,
			},
		})
		res.status(201).json(user)
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				return res
					.status(400)
					.json({ error: 'Username or email already exists.' })
			}
		}
		next(error)
	}
}

export const login = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { username, password } = req.body

	if (!username || !password) {
		return res.status(400).json({ error: 'Username and password are required' })
	}

	try {
		const user = await prisma.user.findUnique({ where: { username } })

		if (user && (await bcrypt.compare(password, user.password))) {
			const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
				expiresIn: '24h',
			})
			res.json({ token })
		} else {
			res.status(400).json({ error: 'Email or password is incorrect ' })
		}
	} catch (error) {
		next(error)
	}
}

export const updateUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params
	const { username, email, password } = req.body

	if (!username || !email || !password) {
		return res
			.status(400)
			.json({ error: 'Username, email and password are required' })
	}

	try {
		const hashedPassword = await bcrypt.hash(password, 10)
		const user = await prisma.user.update({
			where: { id },
			data: {
				username,
				email,
				password: hashedPassword,
			},
		})
		res.json(user)
	} catch (error) {
		next(error)
	}
}

export const deleteUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params
	try {
		await prisma.user.delete({ where: { id } })
		res.status(204).send()
	} catch (error) {
		next(error)
	}
}
