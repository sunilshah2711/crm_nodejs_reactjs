import Joi from 'joi'
import {Service} from 'typedi'
import {Helpers} from '../../helpers/Helpers'
import {NextFunction, Request, Response} from 'express'

@Service()
export class EmailTemplateSchema {
  private static _options = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
  }

  public static async validationResponse(schema: any, body: object): Promise<any> {
    const {error, value} = schema.validate(body, this._options)
    if (error) {
      const {details} = error
      const errs: any = []
      details.map(i => errs.push(i.message))
      return {status: 422, data: errs}
    } else {
      return {status: 200, data: value}
    }
  }

  public async validateUUIDRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceUUID = Joi.object().keys({
      uuid: Joi.string().required(),
    })

    const validateRes = await EmailTemplateSchema.validationResponse(workspaceUUID, req.params)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateCreateRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceCreate = Joi.object().keys({
      name: Joi.string().min(3).required(),
      content: Joi.object().required(),
      status: Joi.string().required(),
    })
    const validateRes = await EmailTemplateSchema.validationResponse(workspaceCreate, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      if(req.body.status != "pending" && req.body.status != "approved" ) {
        const errorRes = await Helpers.formatResponse(422, false, 'Invalid Status', {})
        res.status(422).send(errorRes)
      } else 
      {
        if(!['draft','published','archive'].includes(req.body.status) ) {
          const errorRes = await Helpers.formatResponse(422, false, 'Invalid Status', {})
          res.status(422).send(errorRes)
        } else {
          req.body = validateRes.data
          next()
        }
      }
    }
  }

  public async validateUpdateRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceUpdate = Joi.object().keys({
      name: Joi.string().min(3).required(),
      content: Joi.object().required(),
      status: Joi.string().required(),
    })
    const validateRes = await EmailTemplateSchema.validationResponse(workspaceUpdate, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      if(!['draft','published','archive'].includes(req.body.status) ) {
        const errorRes = await Helpers.formatResponse(422, false, 'Invalid Status', {})
        res.status(422).send(errorRes)
      } else {
        req.body = validateRes.data
        next()
      }
    }
  }

  public async validateDeleteRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceDelete = Joi.object().keys({
      uuid: Joi.string().required(),
    })
    const validateRes = await EmailTemplateSchema.validationResponse(workspaceDelete, req.params)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

}