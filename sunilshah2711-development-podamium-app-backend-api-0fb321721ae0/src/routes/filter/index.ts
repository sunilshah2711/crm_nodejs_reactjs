import express, { Request, Response } from 'express'
const filterRoute = express.Router()
import { Container } from 'typedi'
import { Auth } from '../../middleware/Auth'
import { FilterController } from '../../controllers/FilterController'
import { FilterSchema } from '../../schema/filter/filterSchema';
import { Workspace } from '../../middleware/Workspace'

const auth = Container.get(Auth)
const workspace = Container.get(Workspace);
const filterController = Container.get(FilterController)
const filterSchema = Container.get(FilterSchema)

// projectRoute.post('/:workspaceId/filter/get', [auth.validateToken, workspace.userHasWorkspacePermission], (req: Request, res: Response) => {
//     return filterController.showAll(req, res)
// })

filterRoute.post('/:workspaceId/filter/get', [auth.validateToken, workspace.userHasWorkspacePermission], (req: Request, res: Response) => {
    return filterController.showAll(req, res)
})

filterRoute.post('/:workspaceId/filter/getbytype', [auth.validateToken, workspace.userHasWorkspacePermission, filterSchema.validateTypeRequest], (req: Request, res: Response) => {
    return filterController.getByType(req, res)
})

filterRoute.post('/:workspaceId/filter/save', [auth.validateToken, workspace.userHasWorkspacePermission, filterSchema.validateCreateRequest], (req: Request, res: Response) => {
    return filterController.save(req, res)
})

filterRoute.post('/:workspaceId/filter/saveas', [auth.validateToken, workspace.userHasWorkspacePermission, filterSchema.validateSaveasRequest], (req: Request, res: Response) => {
    return filterController.saveAs(req, res)
})

filterRoute.post('/:workspaceId/filter/delete', [auth.validateToken, workspace.userHasWorkspacePermission, filterSchema.validateDeleteRequest], (req: Request, res: Response) => {
    return filterController.delete(req, res)
})

export { filterRoute }