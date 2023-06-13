import express, { Request, Response } from 'express'
const senderRoute = express.Router()
import { Container } from 'typedi'
import { Auth } from '../../middleware/Auth'
import { SendersController } from '../../controllers/SendersController'
import { SenderSchema } from '../../schema/sender/senderSchema'
import { Workspace } from  '../../middleware/Workspace'

const auth = Container.get(Auth)
const workspace = Container.get(Workspace);
const senderController = Container.get(SendersController)
const senderSchema = Container.get(SenderSchema)

senderRoute.get('/:workspaceId/senders/:uuid', [auth.validateToken, workspace.userHasWorkspacePermission,  senderSchema.validateUUIDRequest], (req: Request, res: Response) => {
  return senderController.getByUUID(req, res)
})

senderRoute.post('/:workspaceId/senders', [auth.validateToken, workspace.userHasWorkspacePermission], (req: Request, res: Response) => {
  return senderController.showAll(req, res)
})

senderRoute.post('/:workspaceId/senders/create', [auth.validateToken, workspace.userHasWorkspacePermission, senderSchema.validateCreateRequest], (req: Request, res: Response) => {
  return senderController.create(req, res)
})

senderRoute.post('/:workspaceId/senders/update/:uuid', [auth.validateToken, workspace.userHasWorkspacePermission, senderSchema.validateUpdateRequest], (req: Request, res: Response) => {
  return senderController.update(req, res)
})

senderRoute.post('/:workspaceId/senders/delete/:uuid', [auth.validateToken, workspace.userHasWorkspacePermission, senderSchema.validateDeleteRequest], (req: Request, res: Response) => {
  return senderController.delete(req, res)
})


export { senderRoute }