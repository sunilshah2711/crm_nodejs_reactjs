import Joi from 'joi'
import { Service } from 'typedi'
import { Helpers } from '../../helpers/Helpers'
import { NextFunction, Request, Response } from 'express'
const moment = require('moment')
@Service()
export class CampaignSchema {
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

  public async validateUUIDRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceUUID = Joi.object().keys({
      id: Joi.string().required(),
    })

    const validateRes = await CampaignSchema.validationResponse(workspaceUUID, req.query)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateCreateRequest(req: Request, res: Response, next: NextFunction) {
    const campaignCreate = Joi.object().keys({
      title: Joi.string().required(),
      subject: Joi.string().required(),
      template_id: Joi.string().min(3).required(),
      audience: Joi.array().required(),
      status: Joi.string().required()
    })
    const validateRes = await CampaignSchema.validationResponse(campaignCreate, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      if (!['schedule', 'draft'].includes(req.body.status)) {
        const errorRes = await Helpers.formatResponse(422, false, 'Invalid status submitted', {})
        res.status(422).send(errorRes)
      } else if (req.body.status === "schedule" && (req.body.schedule == "" || req.body.schedule == undefined)) {
        const errorRes = await Helpers.formatResponse(422, false, 'Invalid schedule datetime', {})
        res.status(422).send(errorRes)
      } else if (req.body.status === "schedule" && moment.isAfter(req.body.schedule)) {
        const errorRes = await Helpers.formatResponse(422, false, 'Only future date allowed', {})
        res.status(422).send(errorRes)
      } else {
        req.body = validateRes.data
        next()
      }

    }
  }

  public async validateUpdateRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceUpdate = Joi.object().keys({
      title: Joi.string().required(),
      subject: Joi.string().required(),
      template_id: Joi.string().min(3).required(),
      audience: Joi.array().required(),
      status: Joi.string().required()
    })
    const validateRes = await CampaignSchema.validationResponse(workspaceUpdate, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      if (!['schedule', 'draft'].includes(req.body.status)) {
        const errorRes = await Helpers.formatResponse(422, false, 'Invalid status submitted', {})
        res.status(422).send(errorRes)
      } else if (req.body.status === "schedule" && (req.body.schedule == "" || req.body.schedule == undefined)) {
        const errorRes = await Helpers.formatResponse(422, false, 'Invalid schedule datetime', {})
        res.status(422).send(errorRes)
      } else if (req.body.status === "schedule" && moment.isAfter(req.body.schedule)) {
        const errorRes = await Helpers.formatResponse(422, false, 'Only future date allowed', {})
        res.status(422).send(errorRes)
      } else {
        req.body = validateRes.data
        next()
      }
    }
  }

  public async validateDeleteRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceDelete = Joi.object().keys({
      id: Joi.string().required(),
    })
    const validateRes = await CampaignSchema.validationResponse(workspaceDelete, req.query)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

}