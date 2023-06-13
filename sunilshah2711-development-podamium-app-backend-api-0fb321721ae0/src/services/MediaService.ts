import { Service } from 'typedi'
import { Helpers } from '../helpers/Helpers'
import { Media } from '../model/Media'
import aws from "aws-sdk"
import fs from "fs"
import { Request, Response } from 'express'

@Service()
export class MediaService {

  private async checkImageByName(name: string, workspace_id: number): Promise<object> {
    return Media.query().findOne({
      name,
      workspace_id
    })
  }

  public async getMedia(req: Request, res: Response): Promise<object> {
    const { workspace_id } = req["user_workspace"]
    const { user_id } = req["user"]

    const mediaRes = await Media.query().where({
      user_id,
      workspace_id
    }).select('uuid', 'name', 'image_url', 'created_at', 'updated_at')
    .withGraphFetched('[created_by]')

    return Helpers.formatResponse(200, true, 'Media List', mediaRes)
  }

  async saveImage(req: Request, res: Response): Promise<object> {

    const { name } = req.body
    const { workspace_id } = req["user_workspace"]

    const imageExist = await this.checkImageByName(name, workspace_id)

    if (imageExist) {
      return Helpers.formatResponse(422, true, 'Name already used!')
    }

    await this.uploadImageToS3(req, res)
    return Helpers.formatResponse(200, true, 'Image saved success!')
  }

  async removeImage(req: Request, res: Response): Promise<any> {
    const { imageUUID } = req.body
    const workspace = req["workSpaceUUID"]

    const mediaData = await Media.query().findOne({
      uuid: imageUUID
    })

    aws.config.setPromisesDependency(undefined)
    aws.config.update({
      accessKeyId: process.env.ACCESSKEYID,
      secretAccessKey: process.env.SECRETACCESSKEY,
      region: process.env.REGION
    });

    const bucketPath = workspace + '/' + mediaData['image_name']

    const s3 = new aws.S3()
    let params = {
      Bucket: process.env.BUCKET_NAME,
      Key: bucketPath
    }

    s3.deleteObject(params, async (err, data) => {
      if (err) {
        console.log(err, err.stack)
        return false
      }
      else {
        await Media.query().delete().where({
          uuid: imageUUID
        })
      }
    })

    return Helpers.formatResponse(200, true, 'Image delete success!')
  }


  private async uploadImageToS3(req, res) {

    const { name } = req.body
    const { user_id } = req["user"]
    const { workspace_id } = req["user_workspace"]
    const workspace = req["workSpaceUUID"]

    aws.config.setPromisesDependency(undefined)
    aws.config.update({
      accessKeyId: process.env.ACCESSKEYID,
      secretAccessKey: process.env.SECRETACCESSKEY,
      region: process.env.REGION
    });

    const bucketPath = workspace + '/' + new Date().getTime() + '_' + req.file.originalname
    const imageName = new Date().getTime() + '_' + req.file.originalname
    const s3 = new aws.S3()
    var params = {
      ACL: "public-read",
      Bucket: process.env.BUCKET_NAME,
      Body: fs.createReadStream(req["file"]["path"]),
      Key: bucketPath
    }

    s3.upload(params, async (err, data) => {
      if (err) {
        console.log("Error occured while trying to upload to S3 bucket", err);
      }

      if (data) {
        fs.unlinkSync(req["file"]["path"]);
        const locationUrl = data.Location;

        await Media.query().insert({
          uuid: Helpers.alphaHash(),
          name: name,
          user_id: user_id,
          workspace_id: workspace_id,
          image_name: imageName,
          image_url: locationUrl
        })
      }
    })
  }
} 