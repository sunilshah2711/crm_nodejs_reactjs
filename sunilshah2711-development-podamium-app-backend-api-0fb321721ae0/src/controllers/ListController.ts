import { Service } from 'typedi'
import { Request, Response } from 'express'
import { ListService } from '../services/ListService'

@Service()
export class ListController {
  constructor(private readonly listService: ListService) {
  }

  /**
   * Get list by user id
   */

  async getListByUUID(req: Request, res: Response): Promise<any> {
    const { uuid } = req.params
    const { workspace_id } = req['user_workspace'];
    const response = await this.listService.getListByUUID(uuid, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
   * Show all list
   */

  async showAll(req: Request, res: Response): Promise<any> {
    const { workspace_id } = req['user_workspace'];
    const { page_no } = req.body;
    const response = await this.listService.fetchAll(workspace_id, page_no)
    return res.status(response.status).send(response)
  }

  /**
   * Create list
   */

  async create(req: Request, res: Response): Promise<any> {
    const { name, contacts } = req.body
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];

    const response = await this.listService.create(name, user_id, workspace_id, contacts)
    return res.status(response.status).send(response)
  }

  /**
   * Update list
   */

  async update(req: Request, res: Response): Promise<any> {
    const { name } = req.body
    const { uuid } = req.params
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const response = await this.listService.update(uuid, name, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
   * Delete list
   */

  async delete(req: Request, res: Response): Promise<any> {
    const { uuid } = req.params
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const response = await this.listService.delete(uuid, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
   * Add Contacts
   */

  async addContacts(req: Request, res: Response): Promise<any> {
    const { contacts } = req.body
    const { uuid } = req.params
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];

    const response = await this.listService.addContacts(uuid, user_id, workspace_id, contacts)
    return res.status(response.status).send(response)
  }

  /**
   * Get contacts
   */

  async getContacts(req: Request, res: Response): Promise<any> {
    const { uuid } = req.params
    const { workspace_id } = req['user_workspace'];

    const response = await this.listService.getContacts(uuid, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
   * Delete list
   */

  async deleteContacts(req: Request, res: Response): Promise<any> {
    const { mapping_ids } = req.body
    const { uuid } = req.params
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];

    const response = await this.listService.deleteContacts(uuid, user_id, workspace_id, mapping_ids)
    return res.status(response.status).send(response)
  }
}