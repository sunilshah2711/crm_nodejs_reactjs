import { Service } from 'typedi'
import { Helpers } from '../helpers/Helpers'
import { Sender } from '../model/Sender'

@Service()
export class SenderService {
  async getByUUID(uuid: string, workspace_id: number): Promise<any> {
    const record = (await this.geByUUIDtInternal(uuid, workspace_id))
    if (!record) {
      return Helpers.formatResponse(422, false, 'Sender not found!')
    }
    return Helpers.formatResponse(200, true, 'Sender!', record)
  }

  async fetchAll(user_id: number, workspace_id: number, page_no: number = 1, limit: number = 25): Promise<any> {
    const records = await Sender.query().whereNotDeleted()
      .where({
        workspace_id: workspace_id
      }).select('uuid', 'name', 'email', 'status', 'created_at', 'updated_at')
      .withGraphFetched('[created_by]')
      .offset((page_no - 1) * limit)
      .limit(limit)

    return Helpers.formatResponse(200, true, 'Sender list!', records)
  }

  getByEmail(email, workspace_id) {
    return Sender.query().whereNotDeleted()
      .where({
        email: email,
        workspace_id: workspace_id
      }).first()
  }

  geByUUIDtInternal(uuid: string, workspace_id: number) {
    return Sender.query().whereNotDeleted()
      .where({
        uuid: uuid,
        workspace_id: workspace_id
      }).select('uuid', 'name', 'email', 'status', 'created_at', 'updated_at').first()
  }


  async create(name: string, email: string, status: string, user_id: number, workspace_id: number): Promise<any> {
    const recordExists = await this.getByEmail(email, workspace_id)

    if (recordExists) {
      return Helpers.formatResponse(422, false, 'Email already exists!')
    }

    await Sender.query()
      .insert({
        uuid: Helpers.alphaHash(),
        name: name,
        email: email,
        status: status,
        user_id: user_id,
        workspace_id: workspace_id
      })
    return Helpers.formatResponse(200, true, 'Sender added success!')
  }

  async update(uuid: string, name: string, email: string, status: string, user_id: number, workspace_id: number): Promise<any> {
    const record = await this.geByUUIDtInternal(uuid, workspace_id);
    if (!record) {
      return Helpers.formatResponse(422, false, 'Sender not found!')
    }
    const emailExists = (await Sender.query()
      .where({
        email: email,
        workspace_id: workspace_id
      }).whereNotDeleted()
      .whereRaw(`uuid != '${uuid}'`)
    )[0]

    if (emailExists) {
      return Helpers.formatResponse(422, false, 'Email already exists!')
    }

    const result = await Sender.query()
      .patch({
        name: name,
        email: email,
        status: status,
        updated_by: user_id
      }).
      where({
        uuid: uuid,
        workspace_id: workspace_id
      })
    if (!result) {
      return Helpers.formatResponse(422, false, 'Sender not updated');
    }
    return Helpers.formatResponse(200, true, 'Sender updated successfully!')
  }

  async delete(uuid: string, user_id: number, workspace_id: number): Promise<any> {
    const senderExist = (await this.geByUUIDtInternal(uuid, workspace_id))

    if (!senderExist) {
      return Helpers.formatResponse(400, false, 'Sender not exist!')
    }

    await Sender.query()
      .patch({
        deleted_at: new Date().toISOString(),
        deleted_by: user_id
      }).
      where({
        uuid: uuid,
        workspace_id: workspace_id
      })

    return Helpers.formatResponse(200, true, 'Sender deleted successfully!')
  }

}