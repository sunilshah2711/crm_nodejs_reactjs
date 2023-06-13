import { Model } from 'objection'


export class UserWorkspaceLoginHistory extends Model {
  static tableName = 'user_workspace_login_history'
  static get jsonAttributes() {
    return ['history'];
  }
  id: number
  uuid: string
  workspace_id: number
  user_id: number
  history: object
  token: string
}