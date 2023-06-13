import express, { Request, Response } from 'express'
const emailTemplateRoute = express.Router()
import { Container } from 'typedi'
import { Auth } from '../../middleware/Auth'
import { EmailTemplatesController } from '../../controllers/EmailTemplatesController'
import { EmailTemplateSchema } from '../../schema/emailtemplate/emailTemplateSchema'
import { Workspace } from  '../../middleware/Workspace'

const auth = Container.get(Auth)
const workspace = Container.get(Workspace);
const emailTemplateController = Container.get(EmailTemplatesController)
const emailTemplateSchema = Container.get(EmailTemplateSchema)

emailTemplateRoute.get('/:workspaceId/email-templates/:uuid', [auth.validateToken, workspace.userHasWorkspacePermission,  emailTemplateSchema.validateUUIDRequest], (req: Request, res: Response) => {
  return emailTemplateController.getByUUID(req, res)
})

emailTemplateRoute.post('/:workspaceId/email-templates', [auth.validateToken, workspace.userHasWorkspacePermission], (req: Request, res: Response) => {
  return emailTemplateController.showAll(req, res)
})

emailTemplateRoute.post('/:workspaceId/email-templates/create', [auth.validateToken, workspace.userHasWorkspacePermission, emailTemplateSchema.validateCreateRequest], (req: Request, res: Response) => {
  return emailTemplateController.create(req, res)
})

emailTemplateRoute.post('/:workspaceId/email-templates/update/:uuid', [auth.validateToken, workspace.userHasWorkspacePermission, emailTemplateSchema.validateUpdateRequest], (req: Request, res: Response) => {
  return emailTemplateController.update(req, res)
})

emailTemplateRoute.post('/:workspaceId/email-templates/delete/:uuid', [auth.validateToken, workspace.userHasWorkspacePermission, emailTemplateSchema.validateDeleteRequest], (req: Request, res: Response) => {
  return emailTemplateController.delete(req, res)
})


export { emailTemplateRoute }