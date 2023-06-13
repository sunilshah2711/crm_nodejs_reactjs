import Joi from 'joi'
import {Service} from 'typedi'
import {Helpers} from '../../helpers/Helpers'
import {NextFunction, Request, Response} from 'express'

@Service()
export class MediaSchema {
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

  public async validateSaveImageRequest(req: Request, res: Response, next: NextFunction) {
   
    const saveImage = Joi.object().keys({
      name: Joi.string().min(3).required(),
    })
    
    const validateRes = await MediaSchema.validationResponse(saveImage, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateDeleteImageRequest(req: Request, res: Response, next: NextFunction) {
   
    const deleteImage = Joi.object().keys({
      imageUUID: Joi.string().required(),
    })
    
    const validateRes = await MediaSchema.validationResponse(deleteImage, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

}