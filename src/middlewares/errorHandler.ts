import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	console.error(err.stack)
	if (err instanceof PrismaClientKnownRequestError) {
		const error = {
			httpCode: 500,
			text: '🤷',
		}

		if (err.code === 'P2025') {
			error.httpCode = 404
			error.text = 'Record not found'
		} else if (err.code === 'P2003') {
			error.httpCode = 404
			error.text = 'Foreign key constraint failed'
		}

		return res
			.status(error.httpCode)
			.json({ code: err.code, error: error.text })
	}
	res.status(500).json({ error: 'Something went wrong!' })
}
