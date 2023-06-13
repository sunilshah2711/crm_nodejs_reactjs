import Joi from 'joi'
import { Service } from 'typedi'
import { Helpers } from '../../helpers/Helpers'
import { NextFunction, Request, Response } from 'express'

@Service()
export class FilterSchema {
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

  public async validateCreateRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceCreate = Joi.object().keys({
      name: Joi.string().min(3).required(),
      filter_type: Joi.string().required(),
      smart_filter: Joi.object().required(),
      regular_filter: Joi.object().required(),
    })
    const validateRes = await FilterSchema.validationResponse(workspaceCreate, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateTypeRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceCreate = Joi.object().keys({
      filter_type: Joi.string().min(3).required(),
      page_no: Joi.number().required(),
    })
    const validateRes = await FilterSchema.validationResponse(workspaceCreate, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateUpdateRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceUpdate = Joi.object().keys({
      smart_filter: Joi.object().required(),
      regular_filter: Joi.object().required(),
    })
    const validateRes = await FilterSchema.validationResponse(workspaceUpdate, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateSaveasRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceCreate = Joi.object().keys({
      name: Joi.string().min(3).required(),
      filter_type: Joi.string().required(),
      smart_filter: Joi.object().required(),
      regular_filter: Joi.object(),
    })
    const validateRes = await FilterSchema.validationResponse(workspaceCreate, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateDeleteRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceDelete = Joi.object().keys({
      id: Joi.string().required(),
    })
    const validateRes = await FilterSchema.validationResponse(workspaceDelete, req.query)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

}