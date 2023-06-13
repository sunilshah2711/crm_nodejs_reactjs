import { Model } from 'objection'
import objectionSoftDelete from 'objection-js-soft-delete'
import { Contact } from './Contact'
import { User } from './User'

const softDelete = objectionSoftDelete({
  columnName: 'deleted_at',
  deletedValue: new Date(),
  notDeletedValue: null,
});

export class List extends softDelete(Model) {
  static tableName = 'list'
  static relationMappings = {
    contacts: {
      relation: Model.ManyToManyRelation,
      modelClass: Contact,
      join: {
        from: 'list.id',
        through: {
          from: 'list_contacts.list_id',
          to: 'list_contacts.contact_id'
        },
        to: 'contact.id'
      }
    },
    created_by: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      filter: query => query.select('name as user'),
      join: {
        from: 'list.user_id',
        to: 'user.id'
      }
    }
  }

  id: number
  uuid: string
  name: string
  user_id: number
  workspace_id: number
  updated_by: number
  deleted_by: number
  deleted_at: string
} 