import { Model } from 'objection'
import objectionSoftDelete from 'objection-js-soft-delete';

const softDelete = objectionSoftDelete({
  columnName: 'deleted_at',
  deletedValue: new Date(),
  notDeletedValue: null,
});


export class UserWorkspace extends softDelete(Model) {
  static tableName = 'user_workspace'
  id: number
  uuid: string
  workspace_id: number
  user_id: number
  deleted_by: number
  deleted_at: string
}