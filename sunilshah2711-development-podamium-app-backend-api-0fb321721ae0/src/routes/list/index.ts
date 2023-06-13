import express, { Request, Response } from 'express'
const listRoute = express.Router()
import { Container } from 'typedi'
import { Auth } from '../../middleware/Auth'
import { ListController } from '../../controllers/ListController'
import { ListSchema } from '../../schema/list/listSchema'
import { Workspace } from  '../../middleware/Workspace'
const auth = Container.get(Auth)
const listController = Container.get(ListController)
const listSchema = Container.get(ListSchema)
const workspace = Container.get(Workspace)

listRoute.get('/:workspaceId/list/:uuid', [auth.validateToken,workspace.userHasWorkspacePermission, listSchema.validateUUIDRequest], (req: Request, res: Response) => {
  return listController.getListByUUID(req, res)
})

listRoute.post('/:workspaceId/list', [auth.validateToken,workspace.userHasWorkspacePermission ], (req: Request, res: Response) => {
  return listController.showAll(req, res)
})

listRoute.post('/:workspaceId/list/create', [auth.validateToken,workspace.userHasWorkspacePermission, listSchema.validateCreateRequest], (req: Request, res: Response) => {
  return listController.create(req, res)
})

listRoute.post('/:workspaceId/list/update/:uuid', [auth.validateToken,workspace.userHasWorkspacePermission, listSchema.validateUpdateRequest], (req: Request, res: Response) => {
  return listController.update(req, res)
})

listRoute.post('/:workspaceId/list/add-contacts/:uuid', [auth.validateToken,workspace.userHasWorkspacePermission, listSchema.validateAddContactsRequest], (req: Request, res: Response) => {
  return listController.addContacts(req, res)
})

listRoute.get('/:workspaceId/list/get-contacts/:uuid', [auth.validateToken,workspace.userHasWorkspacePermission], (req: Request, res: Response) => {
  return listController.getContacts(req, res)
})

listRoute.post('/:workspaceId/list/delete-contacts/:uuid', [auth.validateToken,workspace.userHasWorkspacePermission, listSchema.validateDeleteContactsRequest], (req: Request, res: Response) => {
  return listController.deleteContacts(req, res)
})

listRoute.post('/:workspaceId/list/delete/:uuid', [auth.validateToken,workspace.userHasWorkspacePermission, listSchema.validateDeleteRequest], (req: Request, res: Response) => {
  return listController.delete(req, res)
})


export { listRoute }