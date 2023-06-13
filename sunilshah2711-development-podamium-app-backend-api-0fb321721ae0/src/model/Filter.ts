import { Model } from 'objection'
import objectionSoftDelete from 'objection-js-soft-delete'
import { User } from './User';

const softDelete = objectionSoftDelete({
    columnName: 'deleted_at',
    deletedValue: new Date(),
    notDeletedValue: null,
});

export class Filter extends softDelete(Model) {
    static tableName = 'filter'

    id: number
    uuid: string
    user_id: number
    workspace_id: number
    name: string
    filter_type: string
    smart_filter: string
    regular_filter: string
    deleted_at: string
    updated_by: number
    deleted_by: number

    static relationMappings = {
        created_by: {
            relation: Model.BelongsToOneRelation,
            modelClass: User,
            filter: query => query.select('name as user'),
            join: {
                from: 'filter.user_id',
                to: 'user.id'
            }
        }
    }
}