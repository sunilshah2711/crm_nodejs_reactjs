import knex from 'knex'
import { transaction } from 'objection'
import { Service } from 'typedi'
import { Helpers } from '../helpers/Helpers'
import { List } from '../model/List'
import { ListContact } from '../model/ListContact'
import { ContactService } from '../services/ContactService'
@Service()
export class ListService {
  constructor(private readonly contactService: ContactService) {

  }
  async getListByUUID(uuid: string, workspace_id: number): Promise<any> {
    const list = (await this.getByUUID(uuid, workspace_id))
    return Helpers.formatResponse(200, true, 'List!', list)
  }

  async fetchAll(workspace_id: number, page_no: number = 1, limit: number = 25): Promise<any> {
    const list = await List.query().whereNotDeleted()
      .where({
        workspace_id: workspace_id
      }).select('uuid', 'name', 'created_at', 'updated_at')
      .withGraphFetched('[created_by]')
      .offset((page_no - 1)* limit)
      .limit(limit)

    return Helpers.formatResponse(200, true, 'List!', list)
  }

  async getListByName(name, workspace_id) {
    return (await List.query().whereNotDeleted()
      .where({
        name: name,
        workspace_id: workspace_id
      }))[0]

  }

  getByUUID(uuid: string, workspace_id: number) {
    return List.query().whereNotDeleted()
      .where({
        uuid: uuid,
        workspace_id: workspace_id
      }).select('id','uuid', 'name', 'created_at', 'updated_at').first()
  }

  async getContacts(uuid: string, workspace_id:number) {
    const record = await this.getByUUID(uuid, workspace_id);
    if(!record) {
      return Helpers.formatResponse(422, false, 'List not found!')
    }

    const records = await ListContact.query().innerJoin('contact','contact.id','=','list_contacts.contact_id').where({
      'list_contacts.deleted_at':null,
      'list_contacts.list_id':record.id
    }).select('list_contacts.uuid as mapping_id','contact.name','contact.uuid as contact_id','contact.email','contact.contact_no');
    return Helpers.formatResponse(200, true, 'List Contacts!', records) 
  }

  async create(name: string, user_id: number, workspace_id: number, contacts:string[]): Promise<any> {
    const listExist = await this.getListByName(name,workspace_id)

    if (listExist) {
      return Helpers.formatResponse(422, false, 'List already exists!')
    }
    
    let contactObjs = [];
      if(contacts) {
        contactObjs = await this.contactService.getContactsByUUID(contacts, workspace_id);
      }

     await transaction(List, ListContact, async (List, ListContact, trx) => {
        const list = await List.query()
        .insert({
          uuid: Helpers.alphaHash(),
          name: name,
          user_id: user_id,
          workspace_id: workspace_id
        });
        
        const contactListMappings = contactObjs.map(contact => {
          return  {
            uuid: Helpers.alphaHash(),
            contact_id:contact.id,
          list_id: list.id,
          created_by: user_id
          }
        });

        
         await ListContact.query(trx).insertGraph(contactListMappings); 

        return list;
      });

    return Helpers.formatResponse(200, true, 'List added success!')
  }

  async update(uuid: string, name: string, user_id: number, workspace_id: number): Promise<any> {
    const record = await this.getByUUID(uuid, workspace_id);
    if(!record) {
      return Helpers.formatResponse(422, false, 'List not found!')
    }
    const listExists = (await List.query().whereNotDeleted()
      .where({
        name: name,
        workspace_id: workspace_id
      })
      .whereRaw(`uuid != '${uuid}'`)
    )[0]

    if (listExists) {
      return Helpers.formatResponse(422, false, 'List already exists!')
    }

    await List.query()
      .patch({
        name: name,
        updated_by: user_id
      }).
      where({
        uuid: uuid,
        workspace_id: workspace_id
      })
    return Helpers.formatResponse(200, true, 'List updated successfully!')
  }

  async delete(uuid: string, user_id: number, workspace_id: number): Promise<any> {
    const listExist = (await this.getByUUID(uuid, workspace_id))

    if (!listExist) {
      return Helpers.formatResponse(400, false, 'List not exist!')
    }

     await List.query()
      .patch({
        deleted_at: new Date().toISOString(),
        deleted_by: user_id
      }).
      where({
        uuid: uuid,
        workspace_id: workspace_id
      })
    return Helpers.formatResponse(200, true, 'List deleted successfully!')
  }

  async addContacts(uuid: string, user_id: number, workspace_id: number, contacts:string[]): Promise<any> {
    const record = await this.getByUUID(uuid, workspace_id);
    if(!record) {
      return Helpers.formatResponse(422, false, 'List not found!')
    }
    
    let contactObjs = [];
      if(contacts) {
        contactObjs = await this.contactService.getContactsByUUID(contacts, workspace_id);
      }
      
      const contactListMappings = contactObjs.map(contact => {
        return  {
          uuid: Helpers.alphaHash(),
          contact_id:contact.id,
          list_id: record.id,
          created_by: user_id
        }
      });

      await ListContact.knex()
      .table('list_contacts')
        .insert(contactListMappings)
        .onConflict( ['contact_id','list_id']).merge({deleted_at: null,
          deleted_by: null, updated_by: user_id});

    return Helpers.formatResponse(200, true, 'List added success!')
  }

  async deleteContacts(uuid: string, user_id: number, workspace_id: number, mapping_ids:string[]): Promise<any> {
    const record = await this.getByUUID(uuid, workspace_id);
    if(!record) {
      return Helpers.formatResponse(422, false, 'List not found!')
    }
    
    await ListContact.query().where({
      list_id: record.id
    }).whereIn('uuid',mapping_ids)
    .patch({
      deleted_at: new Date().toISOString(),
      deleted_by: user_id
    })

    return Helpers.formatResponse(200, true, 'Contact deleted success!')
  }
}