import { Service } from 'typedi'
import { Helpers } from '../helpers/Helpers'
import { ProjectCategory } from '../model/ProjectCategory'

@Service()
export class ProjectCategoryService {
  async getProjectCategoryByUUID(uuid: string, workspace_id: number): Promise<any> {
    const contact = (await this.getByUUID(uuid, workspace_id))
    if(!contact) {
      return Helpers.formatResponse(422, false, 'Project Category not found!')
    }
    return Helpers.formatResponse(200, true, 'Project Category!', contact)
  }

  async getProjectCategoriesByUUIDs(uuid: string[], workspace_id: number): Promise<any> {
    return ProjectCategory.query().whereNotDeleted().whereIn('uuid',uuid);
  }
  async fetchAll(user_id: number, workspace_id: number, page_no: number = 1, limit: number = 25): Promise<any> {
    const contacts = await ProjectCategory.query().whereNotDeleted()
      .where({
        workspace_id: workspace_id
      }).select('uuid', 'name', 'created_at', 'updated_at')
      .withGraphFetched('[created_by]')
      .offset((page_no-1)* limit)
      .limit(limit)

    return Helpers.formatResponse(200, true, 'Project Category list!', contacts)
  }

  async getProjectCategoryByName(name, workspace_id) {
    return await ProjectCategory.query().whereNotDeleted()
      .where({
        name: name,
        workspace_id: workspace_id
      }).first()
  }

   getByUUID(uuid: string,  workspace_id: number) {
    return  ProjectCategory.query().whereNotDeleted()
      .where({
        uuid: uuid,
        workspace_id: workspace_id
      }).select('uuid', 'name', 'user_id', 'created_at', 'updated_at').first()
  }


  async create(name: string, user_id: number, workspace_id: number): Promise<any> {
    const projectCategoryExist = await this.getProjectCategoryByName(name, workspace_id)

    if (projectCategoryExist) {
      return Helpers.formatResponse(422, false, 'Project Category already exists!')
    }

    await ProjectCategory.query()
      .insert({
        uuid: Helpers.alphaHash(),
        name: name,
        user_id: user_id,
        workspace_id: workspace_id
      })
    return Helpers.formatResponse(200, true, 'Project Category added success!')
  }

  async update(uuid: string, name: string, user_id: number, workspace_id: number): Promise<any> {
    const record = await this.getByUUID(uuid, workspace_id);
    if(!record) {
      return Helpers.formatResponse(422, false, 'Project Category not found!')
    }
    const recordExists = (await ProjectCategory.query()
      .where({
        name: name,
        workspace_id: workspace_id
      }).whereNotDeleted()
      .whereRaw(`uuid != '${uuid}'`)
    )[0]
      
    if (recordExists) {
      return Helpers.formatResponse(422, false, 'Project Category already exists!')
    }

    const result = await ProjectCategory.query()
      .patch({
        name: name,
        updated_by: user_id
      }).
      where({
        uuid: uuid,
        workspace_id: workspace_id
      })
      if(!result) {
        return Helpers.formatResponse(422, false, 'Project Category not updated');
      }
    return Helpers.formatResponse(200, true, 'Project Category updated successfully!')
  }

  async delete(uuid: string, user_id: number, workspace_id:number): Promise<any> {
    const recordExist = (await this.getByUUID(uuid, workspace_id))

    if (!recordExist) {
      return Helpers.formatResponse(400, false, 'Project Category not exist!')
    }
    
    await ProjectCategory.query()
      .patch({
        deleted_at: new Date().toISOString(),
        deleted_by: user_id
      }).
      where({
        uuid: uuid,
        workspace_id: workspace_id
      })

    return Helpers.formatResponse(200, true, 'Project Category deleted successfully!')
  }

}