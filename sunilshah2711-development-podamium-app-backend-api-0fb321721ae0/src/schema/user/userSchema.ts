import Joi from 'joi'
import { Service } from 'typedi'
import { Helpers } from '../../helpers/Helpers'
import { NextFunction, Request, Response } from 'express'

@Service()
export class UserSchema {
  private static _options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
  }

  public static async validationResponse(schema: any, body: object): Promise<any> {
    const { error, value } = schema.validate(body, this._options)
    if (error) {
      const { details } = error
      const errs: any = []
      details.map(i => errs.push(i.message))
      return { status: 422, data: errs }
    } else {
      return { status: 200, data: value }
    }
  }

  public async validateRegisterRequest(req: Request, res: Response, next: NextFunction) {
    const userRegister = Joi.object().keys({
      name: Joi.string().min(3).required(),
      email: Joi.string().required().email(),
      password: Joi.string().min(3).required()
    })
    const validateRes = await UserSchema.validationResponse(userRegister, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateLoginRequest(req: Request, res: Response, next: NextFunction) {
    const userLogin = Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().min(3).required()
    })
    console.log("hello insde userSchema.ts")
    const validateRes = await UserSchema.validationResponse(userLogin, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateUpdatePassRequest(req: Request, res: Response, next: NextFunction) {
    let updatePass = Joi.object().keys({
      password: Joi.string().min(3).required(),
      confirm_password: Joi.any().valid(Joi.ref('password')).required()
    })

    const validateRes = await UserSchema.validationResponse(updatePass, req.body)

    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateResetPassRequest(req: Request, res: Response, next: NextFunction) {
    const resetPass = Joi.object().keys({
      email: Joi.string().required().email()
    })

    const validateRes = await UserSchema.validationResponse(resetPass, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateGoogleSigninRequest(req: Request, res: Response, next: NextFunction) {
    const resetPass = Joi.object().keys({
      code: Joi.string().required()
    })

    const validateRes = await UserSchema.validationResponse(resetPass, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }
}