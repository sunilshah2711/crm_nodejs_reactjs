import { Service, Container } from 'typedi'
import { NextFunction, Request, Response } from 'express'
import { Helpers } from '../helpers/Helpers'
import { WorkspaceController } from '../controllers/WorkspaceContoller'
const workSpaceController = Container.get(WorkspaceController)

@Service()
export class Workspace {
  public async userHasWorkspacePermission(req: Request, res: Response, next: NextFunction) {
    const workspaceId = req.params['workspaceId']
    req['workSpaceUUID'] = workspaceId
    const { user_id } = req['user']

    if (!workspaceId) {
      const errorRes = await Helpers.formatResponse(403, false, 'workspace is missing!')
      res.status(403).send(errorRes)
    }
    try {
      const memberShip = await workSpaceController.getUserWorkspaceMembership(user_id, workspaceId);
      if (!memberShip) {
        const errorRes = await Helpers.formatResponse(401, false, `Sorry!, you don't have permission to access this workspace!`)
        res.status(403).send(errorRes)
      }

      req['user_workspace'] = memberShip;
    } catch (e) {
      const error = await Helpers.formatResponse(401, false, 'Unauthorized!', { data: e.message })
      return res.status(401).send(error)
    }
    return next()
  }
}