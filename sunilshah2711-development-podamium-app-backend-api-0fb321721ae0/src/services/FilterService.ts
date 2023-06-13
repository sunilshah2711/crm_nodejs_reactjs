import { Service } from 'typedi'
import { Helpers } from '../helpers/Helpers'
import { Filter } from '../model/Filter'

@Service()
export class FilterService {

  getByUUID(uuid: string, workspace_id: number) {
    return Filter.query().whereNotDeleted()
      .where({
        uuid: uuid,
        workspace_id: workspace_id
      }).select('uuid', 'name', 'filter_type', 'smart_filter', 'regular_filter', 'created_at', 'updated_at').first()
  }

  async fetchAll(user_id: number, workspace_id: number, page_no: number = 1, limit: number = 25): Promise<any> {
    console.log(workspace_id)
    const contacts = await Filter.query().whereNotDeleted()
      .where({
        workspace_id: workspace_id
      }).select('uuid', 'name', 'filter_type', 'smart_filter', 'regular_filter', 'created_at', 'updated_at')
      .withGraphFetched('[created_by]')
      .offset((page_no - 1) * limit)
      .limit(limit)

    return Helpers.formatResponse(200, true, 'Filter list!', contacts)
  }

  async getByType(user_id: number, workspace_id: number, filter_type: string, page_no: number = 1, limit: number = 25): Promise<any> {
    console.log(workspace_id)
    const contacts = await Filter.query().whereNotDeleted()
      .where({
        workspace_id: workspace_id,
        filter_type: filter_type
      }).select('uuid', 'name', 'filter_type', 'smart_filter', 'regular_filter', 'created_at', 'updated_at')
      .withGraphFetched('[created_by]')
      .offset((page_no - 1) * limit)
      .limit(limit)

    return Helpers.formatResponse(200, true, 'Filter list by type!', contacts)
  }

  async save(user_id: number, workspace_id: number, name: string, filter_type: string, smart_filter: string, regular_filter: string): Promise<any> {
    // is filter name in the perameters blank ?
    // if yes call create methode
    // if no call update methode
    const filterExists = (await Filter.query()
      .where({
        name: name,
        workspace_id: workspace_id
      }).whereNotDeleted()
    )[0]

    if (filterExists) {
      const result = await Filter.query()
        .patch({
          smart_filter: JSON.stringify(smart_filter),
          regular_filter: JSON.stringify(regular_filter),
          updated_by: user_id
        }).
        where({
          uuid: filterExists.uuid,
          workspace_id: workspace_id
        })

      const singleresult = await Filter.query().whereNotDeleted()
        .where({
          uuid: filterExists.uuid,
          workspace_id: workspace_id
        }).select('uuid', 'name', 'filter_type', 'smart_filter', 'regular_filter', 'created_at', 'updated_at').first()

      if (!result) {
        return Helpers.formatResponse(422, false, 'Filter not updated');
      } else {
        return Helpers.formatResponse(200, true, 'Filter updated successfully!', singleresult)
      }
    } else {
      await Filter.query()
        .insert({
          uuid: Helpers.alphaHash(),
          user_id: user_id,
          workspace_id: workspace_id,
          name: name,
          filter_type: filter_type,
          smart_filter: JSON.stringify(smart_filter),
          regular_filter: JSON.stringify(regular_filter)
        })

      return Helpers.formatResponse(200, true, 'Filter added successfully!')
    }

  }

  async saveAs(user_id: number, workspace_id: number, name: string, filter_type: string, smart_filter: string, regular_filter: string): Promise<any> {
    // call create method
    await Filter.query()
      .insert({
        uuid: Helpers.alphaHash(),
        user_id: user_id,
        workspace_id: workspace_id,
        name: name,
        filter_type: filter_type,
        smart_filter: JSON.stringify(smart_filter),
        regular_filter: JSON.stringify(regular_filter)
      })

    return Helpers.formatResponse(200, true, 'Filter added successfully!')
  }

  async delete(uuid: string, user_id: number, workspace_id: number): Promise<any> {
    const filtersExist = (await this.getByUUID(uuid, workspace_id))

    if (!filtersExist) {
      return Helpers.formatResponse(400, false, 'Filter not exist!')
    }

    await Filter.query()
      .patch({
        deleted_at: new Date().toISOString(),
        deleted_by: user_id
      }).
      where({
        uuid: uuid,
        workspace_id: workspace_id
      })

    return Helpers.formatResponse(200, true, 'Filter deleted successfully!')
  }
}