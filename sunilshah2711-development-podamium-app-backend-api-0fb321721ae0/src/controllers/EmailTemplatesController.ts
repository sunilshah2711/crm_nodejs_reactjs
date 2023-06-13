import { Service } from 'typedi'
import { Request, Response } from 'express'
import { EmailTemplateService } from '../services/EmailTemplateService'

@Service()
export class EmailTemplatesController {
  constructor(private readonly emailTemplateService: EmailTemplateService) {

  }

  /**
   * Get user by id
   */

  async getByUUID(req: Request, res: Response): Promise<any> {
    const { uuid } = req.params
    const { workspace_id } = req['user_workspace'];
    const response = await this.emailTemplateService.getByUUID(uuid, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
   * Show all email templates
   */

  async showAll(req: Request, res: Response): Promise<any> {
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const { page_no } = req.body;
    const response = await this.emailTemplateService.fetchAll(user_id, workspace_id, page_no)
    return res.status(response.status).send(response)
  }

  /**
   * Create email templates
   */

  async create(req: Request, res: Response): Promise<any> {
    const { name, content, status } = req.body
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const response = await this.emailTemplateService.create(name, content, status, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
   * Update email templates
   */

  async update(req: Request, res: Response): Promise<any> {
    const { name, content, status } = req.body
    const { uuid } = req.params
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const response = await this.emailTemplateService.update(uuid, name, content, status, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
   * Delete email templates
   */

  async delete(req: Request, res: Response): Promise<any> {
    const { uuid } = req.params
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const response = await this.emailTemplateService.delete(uuid, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

}