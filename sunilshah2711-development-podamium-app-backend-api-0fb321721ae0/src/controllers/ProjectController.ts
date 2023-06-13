import { Service } from 'typedi'
import { Request, Response } from 'express'
import { ProjectService } from '../services/ProjectService'
import { Helpers } from '../helpers/Helpers';

import { projectStatuses, taskTypes, taskStatuses } from '../config/constants';

@Service()
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {

  }

  /**
  * Get status
  */

  async getStatuses(req: Request, res: Response): Promise<any> {
    const response = await Helpers.formatResponse(200, true, 'Project Statuses!', projectStatuses);
    return res.status(response.status).send(response);
  }

  /**
  * Get task type
  */

  async getTaskTypes(req: Request, res: Response): Promise<any> {
    const response = await Helpers.formatResponse(200, true, 'Task Types', taskTypes);
    return res.status(response.status).send(response);
  }

  /**
  * Get task status
  */

  async getTaskStatuses(req: Request, res: Response): Promise<any> {
    const response = await Helpers.formatResponse(200, true, 'Task Statuses', taskStatuses);
    return res.status(response.status).send(response);
  }

  /**
  * Get project id
  */

  async getProjectByUUID(req: Request, res: Response): Promise<any> {
    const { uuid } = req.params
    const { workspace_id } = req['user_workspace'];
    const response = await this.projectService.getProjectByUUID(uuid, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
  * Show all project
  */

  async showAll(req: Request, res: Response): Promise<any> {
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const { page_no } = req.body;
    const response = await this.projectService.fetchAll(user_id, workspace_id, page_no)
    return res.status(response.status).send(response)
  }

  /**
  * Create project
  */

  async create(req: Request, res: Response): Promise<any> {
    const { name, description, start_date, end_date, project_category_id } = req.body
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const response = await this.projectService.create(name, description, start_date, end_date, project_category_id, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
  * Update project
  */

  async update(req: Request, res: Response): Promise<any> {
    const { name, description, start_date, end_date, project_category_id } = req.body
    const { uuid } = req.params
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const response = await this.projectService.update(uuid, name, description, start_date, end_date, project_category_id, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
  * Update user assignee
  */

  async updateAssignee(req: Request, res: Response): Promise<any> {
    const { assignee } = req.body
    const { uuid } = req.params
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const response = await this.projectService.updateAssignee(uuid, assignee, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
  * Remove user assignee
  */

  async removeAssignee(req: Request, res: Response): Promise<any> {
    const { assignee } = req.body
    const { uuid } = req.params
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const response = await this.projectService.removeAssignee(uuid, assignee, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
  * Delete user assignee
  */

  async delete(req: Request, res: Response): Promise<any> {
    const { uuid } = req.params
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const response = await this.projectService.delete(uuid, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
  * Update project status
  */

  async updateStatus(req: Request, res: Response): Promise<any> {
    const { uuid } = req.params
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const { status } = req.body
    const response = await this.projectService.updateStatus(uuid, status, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
  * Create board task
  */

  async createTask(req: Request, res: Response): Promise<any> {
    const { uuid } = req.params
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const { type, name, description, start_date, end_date, priority, parent_id } = req.body
    const response = await this.projectService.createTask(uuid, type, name, description, start_date, end_date, priority, parent_id, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
 * Update board task
 */

  async updateTask(req: Request, res: Response): Promise<any> {
    const { uuid, taskId } = req.params
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const { type, name, description, start_date, end_date, priority, parent_id, status } = req.body
    const response = await this.projectService.updateTask(uuid, taskId, type, name, status, description, start_date, end_date, priority, parent_id, user_id, workspace_id)
    console.log(req.body);
    return res.status(response.status).send(response)
  }

  /**
 * Delete board task
 */

  async deleteTask(req: Request, res: Response): Promise<any> {
    const { uuid, taskId } = req.params
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const response = await this.projectService.deleteTask(uuid, taskId, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
 * Show all board task
 */

  async showAllTasks(req: Request, res: Response): Promise<any> {
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const { page_no } = req.body;
    const { uuid } = req.params
    const response = await this.projectService.fetchAllTasks(user_id, uuid, workspace_id, page_no)
    return res.status(response.status).send(response)
  }

  /**
* Show filterd board task
*/

  async filterTasks(req: Request, res: Response): Promise<any> {
    const { user_id } = req['user']
    const { uuid } = req.query
    const { workspace_id } = req['user_workspace'];
    const { page_no } = req.body
    const filter = req.query;

    filter.hasOwnProperty('uuid')
    delete filter['uuid']
    filter.hasOwnProperty('uuid')

    const response = await this.projectService.fetchFilterdTasks(user_id, uuid, workspace_id, page_no, filter)

    return res.status(response.status).send(response)
  }

  /**
 * Create comment on task
 */

  async createTaskComment(req: Request, res: Response): Promise<any> {
    const { uuid, taskId } = req.params
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const { comment } = req.body
    const response = await this.projectService.createTaskComment(uuid, taskId, comment, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
 * Update comment on task
 */

  async updateTaskComment(req: Request, res: Response): Promise<any> {
    const { uuid, taskId, commentId } = req.params
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const { comment } = req.body
    const response = await this.projectService.updateTaskComment(uuid, taskId, commentId, comment, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
 * Delete comment on task
 */

  async deleteTaskComment(req: Request, res: Response): Promise<any> {
    const { uuid, taskId, commentId } = req.params
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const response = await this.projectService.deleteTaskComment(uuid, taskId, commentId, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
 * Show all comment on task
 */

  async showAllTaskComments(req: Request, res: Response): Promise<any> {
    const { uuid, taskId } = req.params
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const { page_no } = req.body;
    const response = await this.projectService.showAllTaskComments(user_id, uuid, taskId, workspace_id, page_no)
    return res.status(response.status).send(response)
  }
}