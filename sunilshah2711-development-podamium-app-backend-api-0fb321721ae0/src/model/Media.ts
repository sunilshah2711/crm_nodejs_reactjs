import { Model } from 'objection'
import { User } from './User'

export class Media extends Model {
  static tableName = 'media'
  id: number
  uuid: string
  name: string
  user_id: number
  workspace_id: number
  image_name: string
  image_url: string

  static relationMappings = {
    created_by: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      filter: query => query.select('name as user'),
      join: {
        from: 'media.user_id',
        to: 'user.id'
      }
    }
  }

}