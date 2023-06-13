import { Service } from 'typedi'
import { Helpers } from '../helpers/Helpers'
import { EmailTemplate } from '../model/EmailTemplate'

@Service()
export class EmailTemplateService {
  async getByUUID(uuid: string, workspace_id: number): Promise<any> {
    const emailTemplate = (await this.geByUUIDtInternal(uuid, workspace_id))
    if(!emailTemplate) {
      return Helpers.formatResponse(422, false, 'Email Template not found!')
    }
    return Helpers.formatResponse(200, true, 'Email Template!', emailTemplate)
  }

  async fetchAll(user_id: number, workspace_id: number, page_no: number = 1, limit: number = 25): Promise<any> {
    const emailTemplates = await EmailTemplate.query().whereNotDeleted()
      .where({
        workspace_id: workspace_id
      }).select('uuid', 'name', 'content', 'status', 'created_at', 'updated_at')
      .withGraphFetched('[created_by]')
      .offset((page_no - 1) * limit)
      .limit(limit)

    return Helpers.formatResponse(200, true, 'Email Template list!', emailTemplates)
  }

  getByName(name, workspace_id) {
    return  EmailTemplate.query().whereNotDeleted()
    .where({
      name: name,
      workspace_id: workspace_id
    }).first()

  }

  geByUUIDtInternal(uuid: string,  workspace_id: number) {
    return  EmailTemplate.query().whereNotDeleted()
      .where({
        uuid: uuid,
        workspace_id: workspace_id
      }).select('id','uuid', 'name', 'content', 'status', 'created_at', 'updated_at').first()
  }


  async create(name: string, content: object, status: string, user_id: number, workspace_id: number): Promise<any> {
    const nameExists = await this.getByName(name, workspace_id)

    if (nameExists) {
      return Helpers.formatResponse(422, false, 'Email Template name already exists!')
    }

    await EmailTemplate.query()
      .insert({
        uuid: Helpers.alphaHash(),
        name: name,
        content: content,
        status: status,
        user_id: user_id,
        workspace_id: workspace_id
      })
    return Helpers.formatResponse(200, true, 'Email Template added success!')
  }

  async update(uuid: string, name: string, content: object, status: string, user_id: number, workspace_id: number): Promise<any> {
    const record = await this.geByUUIDtInternal(uuid, workspace_id);
    if(!record) {
      return Helpers.formatResponse(422, false, 'Email Template not found!')
    }
    const emailTemplateExists = (await EmailTemplate.query()
      .where({
        name: name,
        workspace_id: workspace_id
      }).whereNotDeleted()
      .whereRaw(`uuid != '${uuid}'`)
    )[0]
      
    if (emailTemplateExists) {
      return Helpers.formatResponse(422, false, 'Email Template name already exists!')
    }

    const result = await EmailTemplate.query()
      .patch({
        name: name,
        content: content,
        status: status,
        updated_by: user_id
      }).
      where({
        uuid: uuid,
        workspace_id: workspace_id
      })
      if(!result) {
        return Helpers.formatResponse(422, false, 'Email Template not updated');
      }
    return Helpers.formatResponse(200, true, 'Email Template updated successfully!')
  }

  async delete(uuid: string, user_id: number, workspace_id:number): Promise<any> {
    const emailTemplateExist = (await this.geByUUIDtInternal(uuid, workspace_id))

    if (!emailTemplateExist) {
      return Helpers.formatResponse(400, false, 'Email Template not exist!')
    }
    
     await EmailTemplate.query()
      .patch({
        deleted_at: new Date().toISOString(),
        deleted_by: user_id
      }).
      where({
        uuid: uuid,
        workspace_id: workspace_id
      })

    return Helpers.formatResponse(200, true, 'Email Template deleted successfully!')
  }

}