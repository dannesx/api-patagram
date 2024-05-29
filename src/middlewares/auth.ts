import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

export const authenticateToken = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const authHeader = req.headers.authorization
	const token = authHeader && authHeader.split(' ')[1]

	if (!token) {
		return res.sendStatus(401)
	}

	jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
		if (err) {
			return res.sendStatus(403)
		}

		req.jwt = decoded as JwtPayload
		console.log(req.jwt)
		next()
	})
}
