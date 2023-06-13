import { Model } from 'objection'
import objectionSoftDelete from 'objection-js-soft-delete';
const softDelete = objectionSoftDelete({
  columnName: 'deleted_at',
  deletedValue: new Date(),
  notDeletedValue: null,
});

export class Test extends softDelete(Model) {
  static tableName = 'test'

  id: number
  users: string
}