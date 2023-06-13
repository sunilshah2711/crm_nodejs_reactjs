import { Request, Response } from 'express'
import { Service } from 'typedi'
import { UserService } from "../services/UserService"

@Service()
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  /**
      * Create user
      */

  async register(req: Request, res: Response): Promise<any> {
    const { name, email, password } = req.body
    const response = await this.userService.register(name, email, password)
    return res.status(response.status).send(response)
  }

  /**
      * Login user
      */

  async login(req: Request, res: Response): Promise<any> {
    const { email, password } = req.body
    const response = await this.userService.login(email, password)
    return res.status(response.status).send(response)
  }

  /**
    * Forgot password
      */

  async forgotPassword(req: Request, res: Response): Promise<any> {
    const { email } = req.body
    const response = await this.userService.forgotPassword(email)
    return res.status(response.status).send(response)
  }

  /**
      * Update password
      */

  async updatePassword(req: Request, res: Response): Promise<any> {
    const { uuid, token } = req.params
    const { password } = req.body
    const response = await this.userService.updatePassword(uuid, token, password)
    return res.status(response.status).send(response)
  }

  /**
      * Google auth
      */

  async googleSignIn(req: Request, res: Response): Promise<any> {
    const { code } = req.body
    const response = await this.userService.googleSignIn(code)
    console.log("response", response)
    return res.status(response.status).send(response)
  }

  /**
      * Get all users
      */

  async getUsersList(req: Request, res: Response): Promise<any> {
    const { user_id } = req['user']
    const { workspace_id } = req['user_workspace'];

    const response = await this.userService.getUsersList(workspace_id)
    return res.status(200).send(response)
  }
}
