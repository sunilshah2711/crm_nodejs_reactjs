import Joi from 'joi'
import { Service } from 'typedi'
import { Helpers } from '../../helpers/Helpers'
import { NextFunction, Request, Response } from 'express'

@Service()
export class ProjectSchema {
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
      uuid: Joi.string().required(),
    })

    const validateRes = await ProjectSchema.validationResponse(workspaceUUID, req.params)
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
      description: Joi.string().required(),
      start_date: Joi.date().required(),
      end_date: Joi.date().required(),
      project_category_id: Joi.number().required()
    })
    const validateRes = await ProjectSchema.validationResponse(workspaceCreate, req.body)
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
      name: Joi.string().min(3).required(),
      description: Joi.string().required(),
      start_date: Joi.date().required(),
      end_date: Joi.date().required(),
      project_category_id: Joi.number().required()
    })
    const validateRes = await ProjectSchema.validationResponse(workspaceUpdate, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateUpdateAssigneeRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceUpdate = Joi.object().keys({
      assignee: Joi.array().required()
    })
    const validateRes = await ProjectSchema.validationResponse(workspaceUpdate, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateRemoveAssigneeRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceUpdate = Joi.object().keys({
      assignee: Joi.string().required()
    })
    const validateRes = await ProjectSchema.validationResponse(workspaceUpdate, req.body)
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
      uuid: Joi.string().required(),
    })
    const validateRes = await ProjectSchema.validationResponse(workspaceDelete, req.params)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateUpdateStatusRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceDelete = Joi.object().keys({
      status: Joi.number().required(),
    })
    const validateRes = await ProjectSchema.validationResponse(workspaceDelete, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateCreateTasksRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceDelete = Joi.object().keys({
      uuid: Joi.string().required(),
    })
    const validateRes1 = await ProjectSchema.validationResponse(workspaceDelete, req.params)
    if (validateRes1.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes1.data)
      res.status(422).send(errorRes)
    }

    const validator = Joi.object().keys({
      description: Joi.string().required(),
      start_date: Joi.date().required(),
      end_date: Joi.date().required(),
      type: Joi.string().required(),
      name: Joi.string().required(),
      priority: Joi.string().required(),
      parent_id: Joi.number().optional()
    })
    const validateRes = await ProjectSchema.validationResponse(validator, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateUpdateTasksRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceDelete = Joi.object().keys({
      uuid: Joi.string().required(),
      taskId: Joi.string().required()
    })
    const validateRes1 = await ProjectSchema.validationResponse(workspaceDelete, req.params)
    if (validateRes1.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes1.data)
      res.status(422).send(errorRes)
    }

    const validator = Joi.object().keys({
      description: Joi.string().required(),
      start_date: Joi.date().required(),
      end_date: Joi.date().required(),
      type: Joi.string().required(),
      name: Joi.string().required(),
      priority: Joi.string().required(),
      parent_id: Joi.number().optional(),
      status: Joi.number().required()
    })
    const validateRes = await ProjectSchema.validationResponse(validator, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateDeleteTaskRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceDelete = Joi.object().keys({
      uuid: Joi.string().required(),
      taskId: Joi.string().required()
    })
    const validateRes = await ProjectSchema.validationResponse(workspaceDelete, req.params)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateListTasksRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceDelete = Joi.object().keys({
      uuid: Joi.string().required()
    })
    const validateRes = await ProjectSchema.validationResponse(workspaceDelete, req.params)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateFilterTasksRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceDelete = Joi.object().keys({
      uuid: Joi.string(),
      filter: Joi.string()
    })
    const validateRes = await ProjectSchema.validationResponse(workspaceDelete, req.query)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateCreateTaskCommentRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceDelete = Joi.object().keys({
      uuid: Joi.string().required(),
      taskId: Joi.string().required()
    })
    const validateRes1 = await ProjectSchema.validationResponse(workspaceDelete, req.params)
    if (validateRes1.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes1.data)
      res.status(422).send(errorRes)
    }

    const validator = Joi.object().keys({
      comment: Joi.string().required()
    })
    const validateRes = await ProjectSchema.validationResponse(validator, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateUpdateTaskCommentRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceDelete = Joi.object().keys({
      uuid: Joi.string().required(),
      taskId: Joi.string().required(),
      commentId: Joi.string().required()
    })
    const validateRes1 = await ProjectSchema.validationResponse(workspaceDelete, req.params)
    if (validateRes1.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes1.data)
      res.status(422).send(errorRes)
    }

    const validator = Joi.object().keys({
      comment: Joi.string().required()
    })
    const validateRes = await ProjectSchema.validationResponse(validator, req.body)
    if (validateRes.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes.data
      next()
    }
  }

  public async validateDeleteTaskCommentRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceDelete = Joi.object().keys({
      uuid: Joi.string().required(),
      taskId: Joi.string().required(),
      commentId: Joi.string().required()
    })
    const validateRes1 = await ProjectSchema.validationResponse(workspaceDelete, req.params)
    if (validateRes1.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes1.data)
      res.status(422).send(errorRes)
    } else {
      req.body = validateRes1.data
      next()
    }
  }

  public async validateListTaskCommentRequest(req: Request, res: Response, next: NextFunction) {
    const workspaceDelete = Joi.object().keys({
      uuid: Joi.string().required(),
      taskId: Joi.string().required()
    })
    const validateRes1 = await ProjectSchema.validationResponse(workspaceDelete, req.params)
    if (validateRes1.status === 422) {
      const errorRes = await Helpers.formatResponse(422, false, 'Validation failed', validateRes1.data)
      res.status(422).send(errorRes)
    } else {
      next()
    }
  }
}