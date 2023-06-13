import express, { Request, Response } from 'express'
const workspaceRoute = express.Router()
import { Container } from 'typedi'
import { Auth } from '../../middleware/Auth'
import {WorkspaceController} from '../../controllers/WorkspaceContoller'
import {WorkspaceSchema} from '../../schema/workspace/workspaceSchema'
import { Workspace } from  '../../middleware/Workspace'

const auth = Container.get(Auth)
const workSpaceController = Container.get(WorkspaceController)
const workspaceSchema = Container.get(WorkspaceSchema)
const workspace = Container.get(Workspace);
workspaceRoute.get('/workspace/:uuid', [auth.validateToken, workspaceSchema.validateUUIDRequest], (req: Request, res: Response) => {
    return workSpaceController.getWorkspaceByUUID(req, res)
})

workspaceRoute.post('/workspace/delete/:uuid', [auth.validateToken, workspaceSchema.validateDeleteRequest], (req: Request, res: Response) => {
    return workSpaceController.delete(req, res)
})

workspaceRoute.post('/workspace/create', [auth.validateToken, workspaceSchema.validateCreateRequest], (req: Request, res: Response) => {
    return workSpaceController.create(req, res)
})

workspaceRoute.post('/workspace', [auth.validateToken], (req: Request, res: Response) => {
    return workSpaceController.showAll(req, res)
})

workspaceRoute.post('/workspace/update/:uuid', [auth.validateToken, workspaceSchema.validateUpdateRequest], (req: Request, res: Response) => {
    return workSpaceController.update(req, res)
})

workspaceRoute.post('/workspace/login/:workspaceId', [auth.validateToken, workspace.userHasWorkspacePermission], (req: Request, res: Response) => {
    return workSpaceController.doLogin(req, res)
});

export { workspaceRoute }