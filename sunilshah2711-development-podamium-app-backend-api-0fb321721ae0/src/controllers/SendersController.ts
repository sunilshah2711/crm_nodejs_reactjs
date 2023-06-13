import { Service } from 'typedi'
import { Request, Response } from 'express'
import { SenderService } from '../services/SenderService'

@Service()
export class SendersController {
  constructor(private readonly senderService: SenderService) {

  }

  /**
  * Get user id
  */

  async getByUUID(req: Request, res: Response): Promise<any> {
    const { uuid } = req.params
    const { workspace_id } = req['user_workspace'];
    const response = await this.senderService.getByUUID(uuid, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
    * Show all senders
    */

  async showAll(req: Request, res: Response): Promise<any> {
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const { page_no } = req.body;
    const response = await this.senderService.fetchAll(user_id, workspace_id, page_no)
    return res.status(response.status).send(response)
  }

  /**
      * Create senders
      */

  async create(req: Request, res: Response): Promise<any> {
    const { name, email, status } = req.body
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const response = await this.senderService.create(name, email, status, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
      * Update senders
      */

  async update(req: Request, res: Response): Promise<any> {
    const { name, email, status } = req.body
    const { uuid } = req.params
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const response = await this.senderService.update(uuid, name, email, status, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

  /**
      * Delete senders
      */

  async delete(req: Request, res: Response): Promise<any> {
    const { uuid } = req.params
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const response = await this.senderService.delete(uuid, user_id, workspace_id)
    return res.status(response.status).send(response)
  }

}