import { Model } from 'objection'
import objectionSoftDelete from 'objection-js-soft-delete';
const softDelete = objectionSoftDelete({
  columnName: 'deleted_at',
  deletedValue: new Date(),
  notDeletedValue: null,
});

export class ListContact extends softDelete(Model) {
  static tableName = 'list_contacts'

  id: number
  uuid: string
  contact_id: number
  list_id: number
  created_by: number
  updated_by: number
  deleted_by: number
  deleted_at: string
} 