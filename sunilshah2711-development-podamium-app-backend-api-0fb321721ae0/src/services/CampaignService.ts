import { Service } from 'typedi'
import { Helpers } from '../helpers/Helpers'
import { Campaign } from '../model/Campaign'
import { EmailTemplateService } from './EmailTemplateService'
enum statusType {
  'draft',
  'schedule'
}
@Service()
export class CampaignService {
  constructor(private readonly emailTemplateService: EmailTemplateService) {

  }
  async getByUUID(uuid: string, workspace_id: number): Promise<any> {
    const record = (await this.geByUUIDtInternal(uuid, workspace_id))
    if(!record) {
      return Helpers.formatResponse(422, false, 'Campaign not found!')
    }
    return Helpers.formatResponse(200, true, 'Campaign!', record)
  }

  async fetchAll(user_id: number, workspace_id: number, page_no: number = 0, limit: number = 25): Promise<any> {
    const records = await Campaign.query().whereNotDeleted()
      .where({
        workspace_id: workspace_id
      }).select('uuid', 'title', 'subject', 'audiences','template_id','status', 'created_at', 'updated_at')
      .withGraphFetched('[created_by]')
      .offset((page_no - 1) * limit)
      .limit(limit)

    return Helpers.formatResponse(200, true, 'Campaign list!', records)
  }

  getByTitle(title, workspace_id) {
    return  Campaign.query().whereNotDeleted()
    .where({
      title: title,
      workspace_id: workspace_id
    }).first()
  }

  geByUUIDtInternal(uuid: string,  workspace_id: number) {
    return  Campaign.query().whereNotDeleted()
      .where({
        uuid: uuid,
        workspace_id: workspace_id
      }).select('uuid', 'title', 'subject', 'audiences','template_id','schedule','status', 'created_at', 'updated_at').first()
  }


  async create(title : string,subject : string, template_id : string,audience: object,schedule : string, status: statusType, user_id: number, workspace_id: number): Promise<any> {
    const recordExists = await this.getByTitle(title, workspace_id)

    if (recordExists) {
      return Helpers.formatResponse(422, false, 'Title already exists!')
    }

    const template = await this.emailTemplateService.geByUUIDtInternal(template_id, workspace_id); 
    if(!template) {
      return Helpers.formatResponse(422, false, 'Template not exists!')
    }
   
    await Campaign.query().insert({
        uuid: Helpers.alphaHash(),
        title: title,
        subject: subject,
        status: status,
        audiences: audience,
        schedule: schedule,
        template_id: template.id,
        user_id: user_id,
        workspace_id: workspace_id
      });
    return Helpers.formatResponse(200, true, 'Campaign added success!')
  }

  async update(uuid: string, title : string,subject : string, template_id : string,audience: object,schedule : string, status: statusType, user_id: number, workspace_id: number): Promise<any> {
    const record = await this.geByUUIDtInternal(uuid, workspace_id);
    if(!record) {
      return Helpers.formatResponse(422, false, 'Campaign not found!')
    }
    if(record.status === 'sent') {
      return Helpers.formatResponse(422, false, 'Campaign already finished, so you can not update it!')
    }
    const titleExists = (await Campaign.query()
      .where({
        title: title,
        workspace_id: workspace_id
      }).whereNotDeleted()
      .whereRaw(`uuid != '${uuid}'`)
    )[0]
      
    if (titleExists) {
      return Helpers.formatResponse(422, false, 'Title already exists!')
    }
    const template = await this.emailTemplateService.geByUUIDtInternal(template_id, workspace_id); 
    if(!template) {
      return Helpers.formatResponse(422, false, 'Template not exists!')
    }
    const result = await Campaign.query()
      .patch({
        title: title,
        subject: subject,
        status: status,
        audiences: audience,
        schedule: schedule,
        template_id: template.id,
        updated_by: user_id
      }).
      where({
        uuid: uuid,
        workspace_id: workspace_id
      })
      if(!result) {
        return Helpers.formatResponse(422, false, 'Campaign not updated');
      }
    return Helpers.formatResponse(200, true, 'Campaign updated successfully!')
  }

  async delete(uuid: string, user_id: number, workspace_id:number): Promise<any> {
    const campaignExist = (await this.geByUUIDtInternal(uuid, workspace_id))

    if (!campaignExist) {
      return Helpers.formatResponse(400, false, 'Campaign not exist!')
    }
    
      await Campaign.query()
      .patch({
        deleted_at: new Date().toISOString(),
        deleted_by: user_id
      }).
      where({
        uuid: uuid,
        workspace_id: workspace_id
      })

    return Helpers.formatResponse(200, true, 'Campaign deleted successfully!')
  }

}