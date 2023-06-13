import { Model } from 'objection'
import objectionSoftDelete from 'objection-js-soft-delete';
import { User } from './User';
const softDelete = objectionSoftDelete({
  columnName: 'deleted_at',
  deletedValue: new Date(),
  notDeletedValue: null,
});

export class Campaign extends softDelete(Model) {
  static tableName = 'campaigns'
  static get jsonAttributes() {
    return ['audiences'];
  }

  id: number
  uuid: string
  title: string
  subject: string
  audiences: object
  template_id: number
  status: string
  user_id: number
  schedule: string
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
        from: 'campaigns.user_id',
        to: 'user.id'
      }
    }
  }
}