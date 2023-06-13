import { Model } from 'objection'
import objectionSoftDelete from 'objection-js-soft-delete'
import { User } from './User'

const softDelete = objectionSoftDelete({
  columnName: 'deleted_at',
  deletedValue: new Date(),
  notDeletedValue: null,
});

export class ProjectCategory extends softDelete(Model) {
  static tableName = 'project_category'

  id: number
  uuid: string
  name: string
  user_id: number
  workspace_id: number
  updated_by: number
  deleted_by: number
  deleted_at: string

  static relationMappings = {
    created_by: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      filter: query => query.select('name as user'),
      join: {
        from: 'project_category.user_id',
        to: 'user.id'
      }
    }
  }
}