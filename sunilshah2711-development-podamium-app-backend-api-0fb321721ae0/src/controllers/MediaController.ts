import { Service } from "typedi"
import { Request, Response } from "express"
import { MediaService } from "../services/MediaService"

@Service()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {
  }

  public async getMedia(req: Request, res: Response): Promise<object> {
    const response = await this.mediaService.getMedia(req, res)
    return res.status(response['status']).send(response)
  }

  /**
   * Create media
   */

  async create(req: Request, res: Response): Promise<any> {

    if (typeof req['file'] === 'undefined') {
      return res.status(404).send(
        {
          isSuccess: false,
          message: 'Please select valid image',
        })
    }

    const mimeType = [
      'image/png',
      'image/jpg',
      'image/jpeg'
    ]

    if (!mimeType.includes(req['file']['mimetype'])) {
      return res.status(404).send({ isSuccess: false, message: 'Only .png, .jpg and .jpeg format allowed!' })
    }

    const response = await this.mediaService.saveImage(req, res)
    return res.status(response['status']).send(response)
  }

  async delete(req: Request, res: Response): Promise<any> {
    const response = await this.mediaService.removeImage(req, res)
    return res.status(response['status']).send(response)
  }
}