import { Model } from 'objection'
import objectionSoftDelete from 'objection-js-soft-delete';
const softDelete = objectionSoftDelete({
  columnName: 'deleted_at',
  deletedValue: new Date(),
  notDeletedValue: null,
});

export class User extends softDelete(Model) {
  static tableName = 'user'

  id: number
  uuid: string
  name: string
  email: string
  password: string
  token: string
  reset_password_token: string
  source_json: object
  source_id: string
  source: string
}