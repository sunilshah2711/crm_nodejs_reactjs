import Joi from 'joi'
import {Service} from 'typedi'
import {Helpers} from '../../helpers/Helpers'
import {NextFunction, Request, Response} from 'express'

@Service()
export class ListSchema {
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
    const listUUID = Joi.object().keys({
      uuid: Joi.string().required(),
    })

    const validateRes = await ListSchema.validationResponse(listUUID, req.params)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateCreateRequest(req: Request, res: Response, next: NextFunction) {
    const listCreate = Joi.object().keys({
      name: Joi.string().min(3).required(),
      contacts: Joi.array()
    })
    const validateRes = await ListSchema.validationResponse(listCreate, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateUpdateRequest(req: Request, res: Response, next: NextFunction) {
    const listUpdate = Joi.object().keys({
      name: Joi.string().min(3).required(),
    })
    const validateRes = await ListSchema.validationResponse(listUpdate, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateDeleteRequest(req: Request, res: Response, next: NextFunction) {
    const listDelete = Joi.object().keys({
      uuid: Joi.string().required(),
    })
    const validateRes = await ListSchema.validationResponse(listDelete, req.params)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateAddContactsRequest(req: Request, res: Response, next: NextFunction) {
    const listAddContacts = Joi.object().keys({
      contacts: Joi.array().required(),
    })
    const validateRes = await ListSchema.validationResponse(listAddContacts, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateDeleteContactsRequest(req: Request, res: Response, next: NextFunction) {
    const listDeletContacts = Joi.object().keys({
      mapping_ids: Joi.array().required(),
    })
    const validateRes = await ListSchema.validationResponse(listDeletContacts, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }
}