import { Request, Response, NextFunction } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getPosts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const posts = await prisma.post.findMany({
			select: {
				id: true,
				imageUrl: true,
				caption: true,
				User: {
					select: {
						username: true,
						email: true,
					},
				},
				comments: {
					select: {
						id: true,
						User: {
							select: {
								username: true,
							},
						},
						text: true,
						createdAt: true,
					},
				},
				likes: true,
				createdAt: true,
				updatedAt: true,
			},
			orderBy: { createdAt: 'desc' },
		})

		const fixedPosts = posts.map(post => ({
			...post,
			comments: post.comments.map(comment => ({
				id: comment.id,
				username: comment.User.username,
				text: comment.text,
				createdAt: comment.createdAt,
			})),
		}))

		res.json(fixedPosts)
	} catch (error) {
		next(error)
	}
}

export const getPostById = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params

	try {
		const post = await prisma.post.findUnique({
			where: { id },
			select: {
				id: true,
				imageUrl: true,
				caption: true,
				User: {
					select: {
						username: true,
						email: true,
					},
				},
				comments: {
					select: {
						id: true,
						User: {
							select: {
								username: true,
							},
						},
						text: true,
						createdAt: true,
					},
				},
				likes: true,
				createdAt: true,
				updatedAt: true,
			},
		})

		if (post) {
			const fixedPost = {
				...post,
				comments: post.comments.map(comment => ({
					id: comment.id,
					username: comment.User.username,
					text: comment.text,
					createdAt: comment.createdAt,
				})),
			}

			res.json(fixedPost)
		} else {
			res.status(404).json({ error: 'Post not found' })
		}
	} catch (error) {
		next(error)
	}
}

export const createPost = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { caption, imageUrl } = req.body
	const userId = req.jwt?.userId

	if (!userId) {
		return res.status(400).json({ error: 'User ID is required' })
	}

	try {
		const newPost = await prisma.post.create({
			data: {
				caption,
				userId,
				imageUrl,
			},
		})
		res.status(201).json(newPost)
	} catch (error) {
		next(error)
	}
}

export const updatePost = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params
	const { caption } = req.body

	try {
		const updatedPost = await prisma.post.update({
			where: { id },
			data: { caption },
		})
		res.json(updatedPost)
	} catch (error) {
		next(error)
	}
}

export const deletePost = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params

	try {
		await prisma.post.delete({
			where: { id },
		})
		res.status(204).send()
	} catch (error) {
		next(error)
	}
}

export const likePost = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { id } = req.params

	try {
		let post = await prisma.post.findUnique({ where: { id } })

		if (!post) {
			return res.status(404).json({ error: 'Post not found ' })
		}

		post = await prisma.post.update({
			where: { id },
			data: {
				likes: { increment: 1 },
			},
		})

		return res.json(post)
	} catch (error) {
		next(error)
	}
}
