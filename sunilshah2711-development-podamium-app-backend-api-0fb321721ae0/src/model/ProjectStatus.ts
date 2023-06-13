import { Model } from 'objection'
import objectionSoftDelete from 'objection-js-soft-delete'

import { projectStatuses } from '../config/constants';

const softDelete = objectionSoftDelete({
  columnName: 'deleted_at',
  deletedValue: new Date(),
  notDeletedValue: null,
});

export class ProjectStatus extends softDelete(Model) {
  static tableName = 'project_status'

  id: number
  uuid: string
  project_id: number
  user_id: number
  previous_status: number
  status_date: string
  status: number
  workspace_id: number
  updated_by: number
  deleted_by: number
  deleted_at: string

  $parseDatabaseJson(json) {
    json = super.$parseDatabaseJson(json);
    if (json.previous_status !== undefined) {
      json.previous_status_label = projectStatuses[json.previous_status]
    }

    if (json.status !== undefined) {
      json.status_label = projectStatuses[json.status]
    }
    return json;
  }
}