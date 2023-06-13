import express, { Request, Response } from 'express'
const projectRoute = express.Router()
import { Container } from 'typedi'
import { Auth } from '../../middleware/Auth'
import { ProjectController } from '../../controllers/ProjectController'
import { ProjectSchema } from '../../schema/project/projectSchema'
import { Workspace } from '../../middleware/Workspace'

const auth = Container.get(Auth)
const workspace = Container.get(Workspace);
const projectController = Container.get(ProjectController)
const projectSchema = Container.get(ProjectSchema)

projectRoute.get('/:workspaceId/projects/get-statuses', [auth.validateToken, workspace.userHasWorkspacePermission], (req: Request, res: Response) => {
  return projectController.getStatuses(req, res)
})

projectRoute.get('/:workspaceId/projects/get-task-types', [auth.validateToken, workspace.userHasWorkspacePermission], (req: Request, res: Response) => {
  return projectController.getTaskTypes(req, res)
})

projectRoute.get('/:workspaceId/projects/get-task-statuses', [auth.validateToken, workspace.userHasWorkspacePermission], (req: Request, res: Response) => {
  return projectController.getTaskStatuses(req, res)
})

projectRoute.get('/:workspaceId/projects/:uuid', [auth.validateToken, workspace.userHasWorkspacePermission, projectSchema.validateUUIDRequest], (req: Request, res: Response) => {
  return projectController.getProjectByUUID(req, res)
})

projectRoute.post('/:workspaceId/projects/get', [auth.validateToken, workspace.userHasWorkspacePermission], (req: Request, res: Response) => {
  return projectController.showAll(req, res)
})

projectRoute.post('/:workspaceId/projects/create', [auth.validateToken, workspace.userHasWorkspacePermission, projectSchema.validateCreateRequest], (req: Request, res: Response) => {
  return projectController.create(req, res)
})

projectRoute.post('/:workspaceId/projects/update/:uuid', [auth.validateToken, workspace.userHasWorkspacePermission, projectSchema.validateUpdateRequest], (req: Request, res: Response) => {
  return projectController.update(req, res)
})
projectRoute.post('/:workspaceId/projects/update-assignee/:uuid', [auth.validateToken, workspace.userHasWorkspacePermission, projectSchema.validateUpdateAssigneeRequest], (req: Request, res: Response) => {
  return projectController.updateAssignee(req, res)
})

projectRoute.post('/:workspaceId/projects/remove-assignee/:uuid', [auth.validateToken, workspace.userHasWorkspacePermission, projectSchema.validateRemoveAssigneeRequest], (req: Request, res: Response) => {
  return projectController.removeAssignee(req, res)
})

projectRoute.post('/:workspaceId/projects/update-status/:uuid', [auth.validateToken, workspace.userHasWorkspacePermission, projectSchema.validateUpdateStatusRequest], (req: Request, res: Response) => {
  return projectController.updateStatus(req, res)
})

projectRoute.post('/:workspaceId/projects/delete/:uuid', [auth.validateToken, workspace.userHasWorkspacePermission, projectSchema.validateDeleteRequest], (req: Request, res: Response) => {
  return projectController.delete(req, res)
})


projectRoute.post('/:workspaceId/projects/:uuid/tasks/create', [auth.validateToken, workspace.userHasWorkspacePermission, projectSchema.validateCreateTasksRequest], (req: Request, res: Response) => {
  return projectController.createTask(req, res)
})

projectRoute.post('/:workspaceId/projects/:uuid/tasks/update/:taskId', [auth.validateToken, workspace.userHasWorkspacePermission, projectSchema.validateUpdateTasksRequest], (req: Request, res: Response) => {
  return projectController.updateTask(req, res)
})

projectRoute.post('/:workspaceId/projects/:uuid/tasks/delete/:taskId', [auth.validateToken, workspace.userHasWorkspacePermission, projectSchema.validateDeleteTaskRequest], (req: Request, res: Response) => {
  return projectController.deleteTask(req, res)
})

projectRoute.post('/:workspaceId/projects/:uuid/tasks/lists', [auth.validateToken, workspace.userHasWorkspacePermission, projectSchema.validateListTasksRequest], (req: Request, res: Response) => {
  return projectController.showAllTasks(req, res)
})

projectRoute.post('/:workspaceId/task/get', [auth.validateToken, workspace.userHasWorkspacePermission], (req: Request, res: Response) => {
  return projectController.filterTasks(req, res)
})

projectRoute.post('/:workspaceId/projects/:uuid/tasks/:taskId/comments/create', [auth.validateToken, workspace.userHasWorkspacePermission, projectSchema.validateCreateTaskCommentRequest], (req: Request, res: Response) => {
  return projectController.createTaskComment(req, res)
})

projectRoute.post('/:workspaceId/projects/:uuid/tasks/:taskId/comments/:commentId/update', [auth.validateToken, workspace.userHasWorkspacePermission, projectSchema.validateUpdateTaskCommentRequest], (req: Request, res: Response) => {
  return projectController.updateTaskComment(req, res)
})

projectRoute.post('/:workspaceId/projects/:uuid/tasks/:taskId/comments/:commentId/delete', [auth.validateToken, workspace.userHasWorkspacePermission, projectSchema.validateDeleteTaskCommentRequest], (req: Request, res: Response) => {
  return projectController.deleteTaskComment(req, res)
})

projectRoute.post('/:workspaceId/projects/:uuid/tasks/:taskId/comments/lists', [auth.validateToken, workspace.userHasWorkspacePermission, projectSchema.validateListTaskCommentRequest], (req: Request, res: Response) => {
  return projectController.showAllTaskComments(req, res)
})
export { projectRoute }