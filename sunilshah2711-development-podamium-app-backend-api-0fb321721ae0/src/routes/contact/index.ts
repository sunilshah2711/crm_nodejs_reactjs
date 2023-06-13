import express, { Request, Response } from 'express'
const contactRoute = express.Router()
import { Container } from 'typedi'
import { Auth } from '../../middleware/Auth'
import { ContactController } from '../../controllers/ContactController'
import { ContactSchema } from '../../schema/contact/contactSchema'
import { Workspace } from '../../middleware/Workspace'

const auth = Container.get(Auth)
const workspace = Container.get(Workspace);
const contactController = Container.get(ContactController)
const contactSchema = Container.get(ContactSchema)

contactRoute.get('/:workspaceId/contacts/get', [auth.validateToken, workspace.userHasWorkspacePermission, contactSchema.validateUUIDRequest], (req: Request, res: Response) => {
  return contactController.getContactByUUID(req, res)
})

contactRoute.post('/:workspaceId/contacts/get', [auth.validateToken, workspace.userHasWorkspacePermission], (req: Request, res: Response) => {
  return contactController.showAll(req, res)
})

contactRoute.post('/:workspaceId/contacts/create', [auth.validateToken, workspace.userHasWorkspacePermission, contactSchema.validateCreateRequest], (req: Request, res: Response) => {
  return contactController.create(req, res)
})

contactRoute.post('/:workspaceId/contacts/update', [auth.validateToken, workspace.userHasWorkspacePermission, contactSchema.validateUpdateRequest], (req: Request, res: Response) => {
  return contactController.update(req, res)
})

contactRoute.post('/:workspaceId/contacts/delete', [auth.validateToken, workspace.userHasWorkspacePermission, contactSchema.validateDeleteRequest], (req: Request, res: Response) => {
  return contactController.delete(req, res)
})


export { contactRoute }