import { Model } from 'objection'
import { User } from './User'
import objectionSoftDelete from 'objection-js-soft-delete';

const softDelete = objectionSoftDelete({
  columnName: 'deleted_at',
  deletedValue: new Date(),
  notDeletedValue: null,
});


export class Workspace extends softDelete(Model) {
  static tableName = 'workspace'

  id: number
  uuid: string
  name: string
  user_id: number
  deleted_by: number
  deleted_at: string

  static relationMappings = {
    owner: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'workspace.user_id',
        to: 'user.id'
      }
    },

    created_by: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      filter: query => query.select('name as user'),
      join: {
        from: 'workspace.user_id',
        to: 'user.id'
      }
    },
    updated_by: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      filter: query => query.select('name as upd_user'),
      join: {
        from: 'workspace.user_id',
        to: 'user.id'
      }
    }
  }
}