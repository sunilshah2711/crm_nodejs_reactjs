import express, { Request, Response } from 'express'
const mediaRoute = express.Router()
import { Container } from 'typedi'
import multer from 'multer'
import { MediaSchema } from '../../schema/media/mediaSchema'
import { MediaController } from '../../controllers/MediaController'
import { Auth } from '../../middleware/Auth'
import { Workspace } from '../../middleware/Workspace'

const auth = Container.get(Auth)
const workspace = Container.get(Workspace)
const mediaController = Container.get(MediaController)
const meadiaSchema = Container.get(MediaSchema)

const upload = multer(
  {
    dest: 'temp/', limits: { fieldSize: 8 * 1024 * 1024 }
  }
).single('pod_image')

mediaRoute.get('/:workspaceId/media', [auth.validateToken, workspace.userHasWorkspacePermission], (req: Request, res: Response) => {
  return mediaController.getMedia(req, res)
})

mediaRoute.post('/:workspaceId/media/create', [auth.validateToken, workspace.userHasWorkspacePermission, upload, meadiaSchema.validateSaveImageRequest], (req: Request, res: Response) => {
  return mediaController.create(req, res)
})

mediaRoute.post('/:workspaceId/media/delete', [auth.validateToken, workspace.userHasWorkspacePermission, meadiaSchema.validateDeleteImageRequest], (req: Request, res: Response) => {
  return mediaController.delete(req, res)
})

export { mediaRoute }