import express, { Request, Response } from 'express'
const projectCategoryRoute = express.Router()
import { Container } from 'typedi'
import { Auth } from '../../middleware/Auth'
import { ProjectCategoryController } from '../../controllers/ProjectCategoryController'
import { ProjectCategorySchema } from '../../schema/projectCategorySchema/projectCategorySchema'
import { Workspace } from  '../../middleware/Workspace'

const auth = Container.get(Auth)
const workspace = Container.get(Workspace);
const projectCategoryController = Container.get(ProjectCategoryController)
const projectCategorySchema = Container.get(ProjectCategorySchema)

projectCategoryRoute.get('/:workspaceId/project-categories/:uuid', [auth.validateToken, workspace.userHasWorkspacePermission,  projectCategorySchema.validateUUIDRequest], (req: Request, res: Response) => {
  return projectCategoryController.getContactByUUID(req, res)
})

projectCategoryRoute.post('/:workspaceId/project-categories', [auth.validateToken, workspace.userHasWorkspacePermission], (req: Request, res: Response) => {
  return projectCategoryController.showAll(req, res)
})

projectCategoryRoute.post('/:workspaceId/project-categories/create', [auth.validateToken, workspace.userHasWorkspacePermission, projectCategorySchema.validateCreateRequest], (req: Request, res: Response) => {
  return projectCategoryController.create(req, res)
})

projectCategoryRoute.post('/:workspaceId/project-categories/update/:uuid', [auth.validateToken, workspace.userHasWorkspacePermission, projectCategorySchema.validateUpdateRequest], (req: Request, res: Response) => {
  return projectCategoryController.update(req, res)
})

projectCategoryRoute.post('/:workspaceId/project-categories/delete/:uuid', [auth.validateToken, workspace.userHasWorkspacePermission, projectCategorySchema.validateDeleteRequest], (req: Request, res: Response) => {
  return projectCategoryController.delete(req, res)
})


export { projectCategoryRoute }