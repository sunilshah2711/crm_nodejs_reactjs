import { Service } from 'typedi'
import { NextFunction, Request, Response } from 'express'
import { Helpers } from '../helpers/Helpers'
import * as jwt from 'jsonwebtoken'

@Service()
export class Auth {
  public async validateToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['x-access-token']

    if (!token) {
      const errorRes = await Helpers.formatResponse(403, false, 'Token is missing!')
      res.status(403).send(errorRes)
    }

    try {
      req['user'] = jwt.verify(token, process.env.JWT_TOKEN_KEY)
    } catch (e) {
      console.log('romaljeee wdww')
      const error = await Helpers.formatResponse(401, false, 'Unauthorized!', { data: e.message })
      return res.status(401).send(error)
    }
    return next()
  }
}