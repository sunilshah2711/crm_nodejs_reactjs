import express, { Request, Response } from 'express'
const campaignRoute = express.Router()
import { Container } from 'typedi'
import { Auth } from '../../middleware/Auth'
import { CampaignsController } from '../../controllers/CampaignsController'
import { CampaignSchema } from '../../schema/campaign/campaignSchema'
import { Workspace } from '../../middleware/Workspace'

const auth = Container.get(Auth)
const workspace = Container.get(Workspace);
const campaignsController = Container.get(CampaignsController)
const campaignSchema = Container.get(CampaignSchema)

campaignRoute.get('/:workspaceId/campaigns/get', [auth.validateToken, workspace.userHasWorkspacePermission, campaignSchema.validateUUIDRequest], (req: Request, res: Response) => {
  return campaignsController.getByUUID(req, res)
})

campaignRoute.post('/:workspaceId/campaigns/get', [auth.validateToken, workspace.userHasWorkspacePermission], (req: Request, res: Response) => {
  return campaignsController.showAll(req, res)
})

campaignRoute.post('/:workspaceId/campaigns/create', [auth.validateToken, workspace.userHasWorkspacePermission, campaignSchema.validateCreateRequest], (req: Request, res: Response) => {
  return campaignsController.create(req, res)
})

campaignRoute.post('/:workspaceId/campaigns/update', [auth.validateToken, workspace.userHasWorkspacePermission, campaignSchema.validateUpdateRequest], (req: Request, res: Response) => {
  return campaignsController.update(req, res)
})

campaignRoute.post('/:workspaceId/campaigns/delete', [auth.validateToken, workspace.userHasWorkspacePermission, campaignSchema.validateDeleteRequest], (req: Request, res: Response) => {
  return campaignsController.delete(req, res)
})


export { campaignRoute }