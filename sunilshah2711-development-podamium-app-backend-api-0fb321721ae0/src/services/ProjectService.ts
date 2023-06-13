import { Service } from 'typedi'
import { Helpers } from '../helpers/Helpers'
import { Project } from '../model/Project'
import { ProjectAssignee } from '../model/ProjectAssignee'
import { ProjectStatus } from '../model/ProjectStatus'
import { ProjectTask } from '../model/ProjectTask'
import { ProjectTaskComment } from '../model/ProjectTaskComment'
import { UserService } from './UserService'

@Service()
export class ProjectService {
  constructor(private readonly userService: UserService) {
  }
  async getProjectByUUID(uuid: string, workspace_id: number): Promise<any> {
    const contact = (await this.getByUUID(uuid, workspace_id, true))
    if (!contact) {
      return Helpers.formatResponse(422, false, 'Project not found!')
    }
    return Helpers.formatResponse(200, true, 'Project!', contact)
  }

  async getContactsByUUID(uuid: string[], workspace_id: number): Promise<any> {
    return Project.query().whereNotDeleted().whereIn('uuid', uuid);
  }
  async fetchAll(user_id: number, workspace_id: number, page_no: number = 1, limit: number = 25): Promise<any> {
    const contacts = await Project.query().whereNotDeleted()
      .where({
        workspace_id: workspace_id
      }).select('uuid', 'name', 'description', 'start_date', 'end_date', 'project_category_id', 'owner_id', 'created_at', 'updated_at', 'last_status')
      .withGraphFetched('[created_by, project_category, assignee,status_history]')
      .offset((page_no - 1) * limit)
      .limit(limit)

    return Helpers.formatResponse(200, true, 'Project list!', contacts)
  }

  async getContactsByEmail(email, workspace_id) {
    return (await Project.query().whereNotDeleted()
      .where({
        email: email,
        workspace_id: workspace_id
      }))[0]

  }

  getByUUID(uuid: string, workspace_id: number, withExtraInfo: boolean = false) {
    let query = Project.query().whereNotDeleted()
      .where({
        uuid: uuid,
        workspace_id: workspace_id
      }).select('id', 'uuid', 'name', 'description', 'start_date', 'end_date', 'project_category_id', 'owner_id', 'created_at', 'updated_at', 'last_status')

    if (withExtraInfo) {
      query = query.withGraphFetched('[created_by, project_category, assignee, status_history]')

    }
    return query.first()
  }

  getTaskByTaskUUID(uuid: string, workspace_id: number, withExtraInfo: boolean = false) {
    let query = ProjectTask.query().whereNotDeleted()
      .where({
        uuid: uuid,
        workspace_id: workspace_id
      }).select('id', 'uuid', 'name', 'description', 'start_date', 'end_date', 'type', 'priority', 'status', 'parent_id', 'created_at', 'updated_at', 'project_id')

    if (withExtraInfo) {
      //query = query.withGraphFetched('[created_by, project_category, assignee, status_history]')

    }
    return query.first()
  }

  getCommentByCommentUUID(task_id: number, commentId: string, workspace_id: number) {
    let query = ProjectTaskComment.query().whereNotDeleted()
      .where({
        uuid: commentId,
        task_id: task_id,
        workspace_id: workspace_id
      }).select('id', 'uuid', 'comment', 'created_at')

    return query.first()
  }

  async create(name: string, description: string, start_date: string, end_date: string, project_category_id: number, user_id: number, workspace_id: number): Promise<any> {

    await Project.query()
      .insert({
        uuid: Helpers.alphaHash(),
        name: name,
        description: description,
        start_date: start_date,
        end_date: end_date,
        project_category_id: project_category_id,
        owner_id: user_id,
        workspace_id: workspace_id
      })
    return Helpers.formatResponse(200, true, 'Project added success!')
  }

  async update(uuid: string, name: string, description: string, start_date: string, end_date: string, project_category_id: number, user_id: number, workspace_id: number): Promise<any> {
    const record = await this.getByUUID(uuid, workspace_id);
    if (!record) {
      return Helpers.formatResponse(422, false, 'Project not found!')
    }

    const result = await Project.query()
      .patch({
        name: name,
        description: description,
        start_date: start_date,
        end_date: end_date,
        project_category_id: project_category_id,
        updated_by: user_id
      }).
      where({
        uuid: uuid,
        workspace_id: workspace_id
      })
    if (!result) {
      return Helpers.formatResponse(422, false, 'Project not updated');
    }
    return Helpers.formatResponse(200, true, 'Project updated successfully!')
  }

  async delete(uuid: string, user_id: number, workspace_id: number): Promise<any> {
    const projectExist = (await this.getByUUID(uuid, workspace_id))

    if (!projectExist) {
      return Helpers.formatResponse(400, false, 'Project not exist!')
    }

    await Project.query()
      .patch({
        deleted_at: new Date().toISOString(),
        deleted_by: user_id
      }).
      where({
        uuid: uuid,
        workspace_id: workspace_id
      })

    return Helpers.formatResponse(200, true, 'Project deleted successfully!')
  }

  async updateAssignee(uuid: string, assignee: string[], user_id: number, workspace_id: number): Promise<any> {
    const record = await this.getByUUID(uuid, workspace_id);
    if (!record) {
      return Helpers.formatResponse(422, false, 'Project not found!')
    }

    const users = await this.userService.getUserByUUIDs(assignee);

    const userIds = [];
    users.forEach(async user => {
      userIds.push(user.id)
      await Project.knex().raw("INSERT INTO project_assignee (`uuid`, `workspace_id`, `project_id`,`user_id`,`created_at`) VALUES ('" + Helpers.alphaHash() + "','" + workspace_id + "','" + record.id + "','" + user.id + "','" + new Date().toISOString() + "') ON DUPLICATE KEY UPDATE deleted_at = NULL")
    });
    await ProjectAssignee.query().where('project_id', record.id).whereNotIn('user_id', userIds).delete();

    return Helpers.formatResponse(200, true, 'Project updated successfully!')
  }

  async removeAssignee(uuid: string, assignee: string, user_id: number, workspace_id: number): Promise<any> {
    const record = await this.getByUUID(uuid, workspace_id);
    if (!record) {
      return Helpers.formatResponse(422, false, 'Project not found!')
    }

    const user = await this.userService.getUserByUUID(assignee);

    await ProjectAssignee.query().where('project_id', record.id).where('user_id', user.id).delete();

    return Helpers.formatResponse(200, true, 'Assignee removed successfully!')
  }

  async updateStatus(uuid: string, status: number, user_id: number, workspace_id: number): Promise<any> {
    const record = await this.getByUUID(uuid, workspace_id);
    if (!record) {
      return Helpers.formatResponse(422, false, 'Project not found!')
    }

    await Project.query().where('id', record.id).update({
      last_status: status
    });

    await ProjectStatus.query().insert({
      uuid: Helpers.alphaHash(),
      workspace_id: workspace_id,
      project_id: record.id,
      previous_status: record.last_status,
      status: status,
      status_date: new Date().toISOString(),
      user_id: user_id
    })

    return Helpers.formatResponse(200, true, 'Project status updated successfully!')
  }

  async createTask(uuid: string, type: string, name: string, description: string, start_date: string, end_date: string, priority: string, parent_id: number, user_id: number, workspace_id: number): Promise<any> {
    const record = await this.getByUUID(uuid, workspace_id);
    if (!record) {
      return Helpers.formatResponse(422, false, 'Project not found!')
    }

    await ProjectTask.query().insert({
      project_id: record.id,
      uuid: Helpers.alphaHash(),
      workspace_id: workspace_id,
      name: name,
      description: description,
      start_date: start_date,
      end_date: end_date,
      priority: priority,
      parent_id: parent_id,
      user_id: user_id,
      status: 0,
      type: type
    })

    return Helpers.formatResponse(200, true, 'Project Task added success!')
  }

  async updateTask(uuid: string, taskId: string, type: string, name: string, status: number, description: string, start_date: string, end_date: string, priority: string, parent_id: number, user_id: number, workspace_id: number): Promise<any> {
    const record = await this.getByUUID(uuid, workspace_id);
    if (!record) {
      return Helpers.formatResponse(422, false, 'Project not found!')
    }

    const task = await this.getTaskByTaskUUID(taskId, workspace_id);
    if (!task) {
      return Helpers.formatResponse(422, false, 'Project task not found!')
    }
    console.log(status);

    await ProjectTask.query().where('id', task.id).update({
      name: name,
      description: description,
      start_date: start_date,
      end_date: end_date,
      priority: priority,
      parent_id: parent_id,
      user_id: user_id,
      type: type,
      status: status,
      updated_by: user_id
    })

    return Helpers.formatResponse(200, true, 'Project Task updated success!')
  }

  async deleteTask(uuid: string, taskId: string, user_id: number, workspace_id: number): Promise<any> {
    const projectExist = (await this.getByUUID(uuid, workspace_id))

    if (!projectExist) {
      return Helpers.formatResponse(400, false, 'Project not exist!')
    }

    const task = await this.getTaskByTaskUUID(taskId, workspace_id);
    if (!task) {
      return Helpers.formatResponse(422, false, 'Project task not found!')
    }

    await ProjectTask.query()
      .patch({
        deleted_at: new Date().toISOString(),
        deleted_by: user_id
      }).
      where({
        id: task.id,
        workspace_id: workspace_id
      })

    return Helpers.formatResponse(200, true, 'Project task deleted successfully!')
  }

  async fetchAllTasks(user_id: number, uuid: string, workspace_id: number, page_no: number = 1, limit: number = 25): Promise<any> {
    const projectExist = (await this.getByUUID(uuid, workspace_id))

    if (!projectExist) {
      return Helpers.formatResponse(400, false, 'Project not exist!')
    }

    const contacts = await ProjectTask.query().whereNotDeleted()
      .where({
        project_id: projectExist.id,
        workspace_id: workspace_id
      }).select('uuid', 'name', 'description', 'start_date', 'end_date', 'type', 'priority', 'status', 'created_at', 'user_id')
      .withGraphFetched('[created_by]')
      .offset((page_no - 1) * limit)
      .limit(limit)

    return Helpers.formatResponse(200, true, 'Project tasks list!', contacts)
  }

  // get filterd task

  async fetchFilterdTasks(user_id: number, uuid: string, workspace_id: number, page_no: number = 1, filter: string, limit: number = 25): Promise<any> {
    const projectExist = (await this.getByUUID(uuid, workspace_id))

    if (!projectExist) {
      return Helpers.formatResponse(400, false, 'Project not exist!')
    }
    console.log(filter.uuid)

    // Get all task
    const gettasks = await ProjectTask.query().whereNotDeleted()
      .where({
        project_id: projectExist.id,
        workspace_id: workspace_id
      }).select('uuid', 'name', 'description', 'start_date', 'end_date', 'type', 'priority', 'status', 'created_at', 'user_id', 'unread')
      .withGraphFetched('[created_by, task_comment]')
      .offset((page_no - 1) * limit)
      .limit(limit)

    // Get task by filter url
    // console.log(filter)

    const allstaticfilter = gettasks.filter(function (item) {
      for (let key in filter) {
        if (item[key] === undefined || item[key] == filter[key]) {
          return true;
        }
        return false;
      }
      return true;
    });

    const nocomment7 = allstaticfilter.filter(function (item) {
      const createddate = item.created_at;
      const currentdate = new Date();
      currentdate.setDate(currentdate.getDate() - 7);
      if (filter.nocomment === "7") {
        if (createddate >= currentdate) {
          if (item.task_comment == "") {
            return true;
          }

        }
      } else {
        return true;
      }
    });

    const nocomment30 = nocomment7.filter(function (item) {
      const createddate = item.created_at;
      const currentdate = new Date();
      currentdate.setDate(currentdate.getDate() - 30);
      if (filter.nocomment === "30") {
        if (createddate >= currentdate) {
          if (item.task_comment == "") {
            return true;
          }
        }
      } else {
        return true;
      }
    });

    const name = nocomment30.filter(function (item) {
      if (filter.name == item.name) {
        return true;
      } else if (filter["name"] === undefined) {
        return true;
      } else {
        return false;
      }
    })

    const description = name.filter(function (item) {
      if (filter.description == item.description) {
        return true;
      } else if (filter["description"] === undefined) {
        return true;
      }
      else {
        return false;
      }
    })

    // console.log(description)

    return Helpers.formatResponse(200, true, 'Project tasks list!', description)
  }

  async createTaskComment(uuid: string, taskId: string, comment: string, user_id: number, workspace_id: number): Promise<any> {
    const projectExist = (await this.getByUUID(uuid, workspace_id))
    if (!projectExist) {
      return Helpers.formatResponse(400, false, 'Project not exist!')
    }

    const task = await this.getTaskByTaskUUID(taskId, workspace_id);
    if (!task) {
      return Helpers.formatResponse(422, false, 'Project task not found!')
    }

    await ProjectTaskComment.query().insert({
      project_id: projectExist.id,
      task_id: task.id,
      uuid: Helpers.alphaHash(),
      workspace_id: workspace_id,
      comment: comment,
      user_id: user_id
    })

    return Helpers.formatResponse(200, true, 'Task comment created successfully!')
  }

  async updateTaskComment(uuid: string, taskId: string, commentId: string, comment: string, user_id: number, workspace_id: number): Promise<any> {
    const projectExist = (await this.getByUUID(uuid, workspace_id))
    if (!projectExist) {
      return Helpers.formatResponse(400, false, 'Project not exist!')
    }

    const task = await this.getTaskByTaskUUID(taskId, workspace_id);
    if (!task) {
      return Helpers.formatResponse(422, false, 'Project task not found!')
    }

    const commentObj = await this.getCommentByCommentUUID(task.id, commentId, workspace_id);
    if (!commentObj) {
      return Helpers.formatResponse(422, false, 'Task comment not found!')
    }
    await ProjectTaskComment.query().where('id', commentObj.id).update({
      comment: comment,
      updated_by: user_id
    })

    return Helpers.formatResponse(200, true, 'Task comment updated successfully!')
  }

  async deleteTaskComment(uuid: string, taskId: string, commentId: string, user_id: number, workspace_id: number): Promise<any> {
    const projectExist = (await this.getByUUID(uuid, workspace_id))
    if (!projectExist) {
      return Helpers.formatResponse(400, false, 'Project not exist!')
    }

    const task = await this.getTaskByTaskUUID(taskId, workspace_id);
    if (!task) {
      return Helpers.formatResponse(422, false, 'Project task not found!')
    }

    const commentObj = await this.getCommentByCommentUUID(task.id, commentId, workspace_id);
    if (!commentObj) {
      return Helpers.formatResponse(422, false, 'Task comment not found!')
    }
    await ProjectTaskComment.query().where('id', commentObj.id).delete()

    return Helpers.formatResponse(200, true, 'Task comment deleted successfully!')
  }

  async showAllTaskComments(user_id: number, uuid: string, taskId: string, workspace_id: number, page_no: number = 1, limit: number = 25): Promise<any> {
    const projectExist = (await this.getByUUID(uuid, workspace_id))

    if (!projectExist) {
      return Helpers.formatResponse(400, false, 'Project not exist!')
    }

    const task = await this.getTaskByTaskUUID(taskId, workspace_id);
    if (!task) {
      return Helpers.formatResponse(422, false, 'Project task not found!')
    }

    const contacts = await ProjectTaskComment.query().whereNotDeleted()
      .where({
        task_id: task.id,
        workspace_id: workspace_id
      }).select('uuid', 'comment', 'created_at', 'user_id')
      .withGraphFetched('[created_by]')
      .offset((page_no - 1) * limit)
      .limit(limit)

    return Helpers.formatResponse(200, true, 'Task Comment list!', contacts)
  }
}