import { Model } from 'objection'
import objectionSoftDelete from 'objection-js-soft-delete'

import { taskStatuses } from '../config/constants';
import { User } from './User';
import { ProjectTaskComment } from './ProjectTaskComment';

const softDelete = objectionSoftDelete({
  columnName: 'deleted_at',
  deletedValue: new Date(),
  notDeletedValue: null,
});

export class ProjectTask extends softDelete(Model) {
  static tableName = 'project_tasks'

  id: number
  uuid: string
  project_id: number
  user_id: number
  status: number
  workspace_id: number
  name: string
  description: string
  start_date: string
  end_date: string
  type: string
  priority: string
  parent_id: number
  unread: number
  updated_by: number
  deleted_by: number
  deleted_at: string

  $parseDatabaseJson(json) {
    json = super.$parseDatabaseJson(json);

    if (json.status !== undefined) {
      json.status_label = taskStatuses[json.status]
    }
    return json;
  }

  static relationMappings = {
    created_by: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      filter: query => query.select('name as user'),
      join: {
        from: 'project_tasks.user_id',
        to: 'user.id'
      }
    },
    task_comment: {
      relation: Model.HasManyRelation,
      modelClass: ProjectTaskComment,
      filter: query => query.select('comment', 'created_at'),
      join: {
        from: 'project_tasks.id',
        to: 'project_task_comments.task_id'
      }
    }
  }
}