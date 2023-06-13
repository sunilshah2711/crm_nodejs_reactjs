import { Service } from 'typedi'
import { Request, Response } from 'express'
import { ProjectCategoryService } from '../services/ProjectCategoryService'

@Service()
export class ProjectCategoryController {
  constructor(private readonly projectCategoryService: ProjectCategoryService) {

  }

  /**
   * Get user id
   */

  async getContactByUUID(req: Request, res: Response): Promise<any> {
    const { uuid } = req.params
    const { workspace_id } = req['user_workspace'];
    const response = await this.projectCategoryService.getProjectCategoryByUUID(uuid, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
   * Show all project category
   */

  async showAll(req: Request, res: Response): Promise<any> {
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const { page_no } = req.body;
    const response = await this.projectCategoryService.fetchAll(user_id, workspace_id, page_no)
    return res.status(response.status).send(response)
  }

  /**
  * Create project category
  */

  async create(req: Request, res: Response): Promise<any> {
    const { name } = req.body
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const response = await this.projectCategoryService.create(name, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
  * Update project category
  */

  async update(req: Request, res: Response): Promise<any> {
    const { name } = req.body
    const { uuid } = req.params
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const response = await this.projectCategoryService.update(uuid, name, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
  * Delete project category
  */

  async delete(req: Request, res: Response): Promise<any> {
    const { uuid } = req.params
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const response = await this.projectCategoryService.delete(uuid, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

}