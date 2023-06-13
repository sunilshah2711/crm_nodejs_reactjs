import { Service } from 'typedi'
import { Helpers } from '../helpers/Helpers'
import { Contact } from '../model/Contact'

@Service()
export class ContactService {
  async getContactByUUID(uuid: string, workspace_id: number): Promise<any> {
    const contact = (await this.getByUUID(uuid, workspace_id))
    if (!contact) {
      return Helpers.formatResponse(422, false, 'Contact not found!')
    }
    return Helpers.formatResponse(200, true, 'Contact!', contact)
  }

  async getContactsByUUID(uuid: string[], workspace_id: number): Promise<any> {
    return Contact.query().whereNotDeleted().whereIn('uuid', uuid);
  }

  async fetchAll(user_id: number, workspace_id: number, page_no: number = 1, limit: number = 25): Promise<any> {
    const contacts = await Contact.query().whereNotDeleted()
      .where({
        workspace_id: workspace_id
      }).select('uuid', 'name', 'email', 'contact_no', 'created_at', 'updated_at')
      .withGraphFetched('[created_by]')
      .offset((page_no - 1) * limit)
      .limit(limit)

    return Helpers.formatResponse(200, true, 'Contact list!', contacts)
  }

  async getContactsByEmail(email, workspace_id) {
    return (await Contact.query().whereNotDeleted()
      .where({
        email: email,
        workspace_id: workspace_id
      }))[0]

  }

  getByUUID(uuid: string, workspace_id: number) {
    return Contact.query().whereNotDeleted()
      .where({
        uuid: uuid,
        workspace_id: workspace_id
      }).select('uuid', 'name', 'email', 'contact_no', 'user_id', 'created_at', 'updated_at').first()
  }


  async create(name: string, email: string, contact_no: string, user_id: number, workspace_id: number): Promise<any> {
    const contactExist = await this.getContactsByEmail(email, workspace_id)

    if (contactExist) {
      return Helpers.formatResponse(422, false, 'Contact already exists!')
    }

    await Contact.query()
      .insert({
        uuid: Helpers.alphaHash(),
        name: name,
        user_id: user_id,
        email: email,
        contact_no: contact_no,
        workspace_id: workspace_id
      })
    return Helpers.formatResponse(200, true, 'Contact added success!')
  }

  async update(uuid: string, name: string, email: string, contact_no: string, user_id: number, workspace_id: number): Promise<any> {
    const record = await this.getByUUID(uuid, workspace_id);
    if (!record) {
      return Helpers.formatResponse(422, false, 'Contact not found!')
    }
    const contactExists = (await Contact.query()
      .where({
        email: email,
        workspace_id: workspace_id
      }).whereNotDeleted()
      .whereRaw(`uuid != '${uuid}'`)
    )[0]

    if (contactExists) {
      return Helpers.formatResponse(422, false, 'Contact already exists!')
    }

    const result = await Contact.query()
      .patch({
        name: name,
        email: email,
        contact_no: contact_no,
        updated_by: user_id
      }).
      where({
        uuid: uuid,
        workspace_id: workspace_id
      })
    if (!result) {
      return Helpers.formatResponse(422, false, 'Contact not updated');
    }
    return Helpers.formatResponse(200, true, 'Contact updated successfully!')
  }

  async delete(uuid: string, user_id: number, workspace_id: number): Promise<any> {
    const contactExist = (await this.getByUUID(uuid, workspace_id))

    if (!contactExist) {
      return Helpers.formatResponse(400, false, 'Contact not exist!')
    }

    await Contact.query()
      .patch({
        deleted_at: new Date().toISOString(),
        deleted_by: user_id
      }).
      where({
        uuid: uuid,
        workspace_id: workspace_id
      })

    return Helpers.formatResponse(200, true, 'Contact deleted successfully!')
  }

}