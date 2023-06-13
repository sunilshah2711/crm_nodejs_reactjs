import { Service } from 'typedi'
import { Request, Response } from 'express'
import { ContactService } from '../services/ContactService'

@Service()
export class ContactController {
  constructor(private readonly contactService: ContactService) {

  }

  /**
   * Get Contact id by user
   */

  async getContactByUUID(req: Request, res: Response): Promise<any> {
    const { id } = req.query
    const { workspace_id } = req['user_workspace'];
    const response = await this.contactService.getContactByUUID(id, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
   * Show all contact
   */

  async showAll(req: Request, res: Response): Promise<any> {
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const { page_no } = req.body;
    const response = await this.contactService.fetchAll(user_id, workspace_id, page_no)
    return res.status(response.status).send(response)
  }

  /**
   * Create contact
   */

  async create(req: Request, res: Response): Promise<any> {
    const { name, email, contact_no } = req.body
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const response = await this.contactService.create(name, email, contact_no, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
   * Update contact
   */

  async update(req: Request, res: Response): Promise<any> {
    const { name, email, contact_no } = req.body
    const { id } = req.query
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const response = await this.contactService.update(id, name, email, contact_no, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
   * Delete contact
   */

  async delete(req: Request, res: Response): Promise<any> {
    const { id } = req.query
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const response = await this.contactService.delete(id, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

}