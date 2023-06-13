import { Service } from 'typedi'
import { Workspace } from '../model/Workspace'
import { Helpers } from '../helpers/Helpers'
import { transaction } from 'objection'
import { UserWorkspace } from '../model/UserWorkspace'
import { UserWorkspaceLoginHistory } from '../model/UserWorkspaceLoginHistory'

@Service()
export class WorkspaceService {
  async getWorkspaceByName(name: string): Promise<any> {
    return (await Workspace.query().whereNotDeleted()
      .where({
        name: name
      }))[0]
  }

  async getByUUID(uuid: string, user_id: number): Promise<any> {
    return (await Workspace.query().whereNotDeleted()
      .where({
        uuid: uuid,
        user_id: user_id
      }).select('id', 'uuid', 'name', 'user_id', 'created_at', 'updated_at'))
  }

  getWorkspaceThroughUUID(uuid: string) {
    return Workspace.query().whereNotDeleted().where({ uuid }).first();
  }

  getUserWorkspaceMembership(userId: number, workspaceId: number) {
    return UserWorkspace.query().whereNotDeleted().where({
      user_id: userId,
      workspace_id: workspaceId
    }).first()
  }

  async getWorkspaceByUUID(uuid: string, user_id: number): Promise<any> {
    const workspace = (await this.getByUUID(uuid, user_id))[0]
    return Helpers.formatResponse(200, true, 'Workspace !', workspace)
  }

  async fetchAll(user_id: number, page_no: number = 1, limit: number = 25): Promise<any> {
    const workspaces = await Workspace.query().whereNotDeleted()
      .where({
        user_id: user_id
      }).select('uuid', 'name', 'created_at', 'updated_at')
      .withGraphFetched('[created_by]')
      .offset((page_no - 1) * limit)
      .limit(limit)

    return Helpers.formatResponse(200, true, 'Workspace list!', workspaces)
  }

  async create(name: string, user_id: number): Promise<any> {
    const workspaceExists = await this.getWorkspaceByName(name)
    if (workspaceExists) {
      return Helpers.formatResponse(422, false, 'Workspace already exists!')
    }

    await transaction(Workspace, UserWorkspace, async (Workspace, UserWorkspace, trx) => {
      const workspace = await Workspace.query()
        .insert({
          uuid: Helpers.alphaHash(),
          name: name,
          user_id: user_id
        });

      await UserWorkspace.query(trx).insert({
        uuid: Helpers.alphaHash(),
        user_id: user_id,
        workspace_id: workspace.id
      })

      return workspace
    });
    return Helpers.formatResponse(200, true, 'Workspace create success!')
  }


  async update(name: string, uuid: string, user_id: number): Promise<any> {
    const workspaceExists = (await Workspace.query().whereNotDeleted()
      .where({
        name: name
      })
      .where({
        user_id: user_id
      }))[0]

    if (workspaceExists) {
      return Helpers.formatResponse(422, false, 'Workspace already exists!')
    }

    await Workspace.query()
      .patch({
        name: name
      }).
      where({
        uuid: uuid,
        user_id: user_id
      })


    return Helpers.formatResponse(200, true, 'Workspace updated successfully!')
  }

  async delete(uuid: string, user_id: number): Promise<any> {
    const workspaceExist = (await this.getByUUID(uuid, user_id))[0]

    if (!workspaceExist) {
      return Helpers.formatResponse(400, false, 'Workspace not exist!')
    }
    if (workspaceExist.user_id !== user_id) {
      return Helpers.formatResponse(400, false, 'Only owner can delete workspace!')
    }

    await transaction(Workspace, UserWorkspace, async (Workspace, UserWorkspace, trx) => {
      await Workspace.query()
        .patch({
          deleted_at: new Date().toISOString(),
          deleted_by: user_id
        })
        .where('uuid', uuid)

      await UserWorkspace.query(trx)
        .patch({
          deleted_at: new Date().toISOString(),
          deleted_by: user_id
        }).where('workspace_id', workspaceExist.id)

      return null;
    });

    return Helpers.formatResponse(200, true, 'Workspace deleted successfully!')
  }

  async doLogin(workspace_id: number, user_id: number, history: object, token: any): Promise<any> {
    await UserWorkspaceLoginHistory.query().insert({
      uuid: Helpers.alphaHash(),
      workspace_id: workspace_id,
      user_id: user_id,
      history: history,
      token: token,
    })

    return Helpers.formatResponse(200, true, 'Login successfully!')
  }
}
