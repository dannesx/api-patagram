import { NextFunction, Request, Response } from 'express'
import { prisma } from '../config/prismaConfig'

export const createComment = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { postId } = req.params
	const { text } = req.body
	const userId = req.jwt?.userId

	if (!text) {
		return res
			.status(400)
			.json({ error: 'You must to type something in your comment!' })
	}

	try {
		const comment = await prisma.comment.create({
			data: { text, postId, userId },
		})

		res.json(comment)
	} catch (error) {
		next(error)
	}
}

export const updateComment = (
	req: Request,
	res: Response,
	next: NextFunction
) => {}

export const deleteComment = (
	req: Request,
	res: Response,
	next: NextFunction
) => {}
