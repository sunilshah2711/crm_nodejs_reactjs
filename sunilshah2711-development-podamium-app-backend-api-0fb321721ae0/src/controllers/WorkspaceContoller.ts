import { Service } from 'typedi'
import { WorkspaceService } from '../services/WorkspaceService'
import { Request, Response } from 'express'
const { lookup } = require('geoip-lite');

@Service()
export class WorkspaceController {
  constructor(private readonly workSpaceService: WorkspaceService) {
  }

  /**
      * Get workspace id
      */

  async getWorkspaceByUUID(req: Request, res: Response): Promise<any> {
    const { uuid } = req.params
    const { user_id } = req['user']
    const response = await this.workSpaceService.getWorkspaceByUUID(uuid, user_id)
    return res.status(response.status).send(response)
  }

  /**
      * Get user workspace membership
      */

  async getUserWorkspaceMembership(userId, workspaceUUId) {
    const workspace = await this.workSpaceService.getWorkspaceThroughUUID(workspaceUUId);
    console.log(workspace)
    return this.workSpaceService.getUserWorkspaceMembership(userId, workspace.id);
  }

  /**
      * Show all workspace
      */

  async showAll(req: Request, res: Response): Promise<any> {
    const { user_id } = req['user']
    const { page_no } = req.body;
    const response = await this.workSpaceService.fetchAll(user_id, page_no)
    return res.status(response.status).send(response)
  }

  /**
      * Create workspace
      */

  async create(req: Request, res: Response): Promise<any> {
    const { name } = req.body
    const { user_id } = req['user']
    const response = await this.workSpaceService.create(name, user_id)
    return res.status(response.status).send(response)
  }

  /**
      * Update workspace
      */

  async update(req: Request, res: Response): Promise<any> {
    const { name } = req.body
    const { uuid } = req.params
    const { user_id } = req['user']
    const response = await this.workSpaceService.update(name, uuid, user_id)
    return res.status(response.status).send(response)
  }

  /**
      * Delete workspace
      */

  async delete(req: Request, res: Response): Promise<any> {
    const { uuid } = req.params
    const { user_id } = req['user']
    const response = await this.workSpaceService.delete(uuid, user_id)
    return res.status(response.status).send(response)
  }

  /**
      * Workspace ip login
      */

  async doLogin(req: Request, res: Response): Promise<any> {
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const history = {
      ip: ip,
      detail: lookup(ip),
      user_agent: req.headers["user-agent"]
    }
    const token = req.headers['x-access-token'];
    const response = await this.workSpaceService.doLogin(workspace_id, user_id, history, token)
    return res.status(response.status).send(response)
  }

}
