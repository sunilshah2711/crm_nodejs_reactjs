import { Model } from 'objection'
import objectionSoftDelete from 'objection-js-soft-delete'
import { ProjectCategory } from './ProjectCategory';
import { ProjectStatus } from './ProjectStatus';
import { User } from './User'

import { projectStatuses } from '../config/constants';

const softDelete = objectionSoftDelete({
  columnName: 'deleted_at',
  deletedValue: new Date(),
  notDeletedValue: null,
});

export class Project extends softDelete(Model) {
  static tableName = 'project'

  id: number
  uuid: string
  name: string
  description: string
  start_date: string
  end_date: string
  last_status: number
  owner_id: number
  workspace_id: number
  project_category_id: number
  updated_by: number
  deleted_by: number
  deleted_at: string

  $parseDatabaseJson(json) {
    json = super.$parseDatabaseJson(json);
    if (json.last_status !== undefined) {
      json.last_status_label = projectStatuses[json.last_status]
    }
    return json;
  }

  static relationMappings = {
    created_by: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      filter: query => query.select('name as user'),
      join: {
        from: 'project.owner_id',
        to: 'user.id'
      }
    },
    project_category: {
      relation: Model.BelongsToOneRelation,
      modelClass: ProjectCategory,
      filter: query => query.select('name', 'uuid'),
      join: {
        from: 'project.project_category_id',
        to: 'project_category.id'
      }
    },
    assignee: {
      relation: Model.ManyToManyRelation,
      modelClass: User,
      filter: query => query.select('user.name', 'user.uuid'),
      join: {
        from: 'project.id',
        through: {
          from: 'project_assignee.project_id',
          to: 'project_assignee.user_id',
          extra: ['uuid']
        },
        to: 'user.id'
      }
    },

    status_history: {
      relation: Model.HasManyRelation,
      modelClass: ProjectStatus,
      filter: query => query.select('project_status.status', 'project_status.previous_status', 'project_status.status_date'),
      join: {
        from: 'project.id',
        to: 'project_status.project_id'
      }
    }
  }
}