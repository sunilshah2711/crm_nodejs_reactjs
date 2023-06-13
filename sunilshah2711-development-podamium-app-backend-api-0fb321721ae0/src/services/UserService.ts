import { Service } from 'typedi'
import { User } from '../model/User'
import { Helpers } from '../helpers/Helpers'
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import * as queryString from 'query-string'
import Axios from 'axios'

@Service()
export class UserService {
  async getUserByEmail(email: string): Promise<any> {
    const userExist = await User.query().whereNotDeleted().where({
      email: email
    }).first()

    return userExist
  }

  async getUserByUUID(uuid: string): Promise<any> {
    const userExist = (await User.query().whereNotDeleted().where({
      uuid: uuid
    }))[0]

    return userExist
  }

  async getUserByUUIDs(uuids: string[]): Promise<any> {

    return User.query().whereNotDeleted().whereIn('uuid', uuids)
  }

  async getUsersList(workspace_id: number): Promise<any> {
    return User.query().select('user.name', 'user.uuid').whereNotDeleted().innerJoin('user_workspace', 'user_workspace.user_id', '=', 'user.id').whereNull('user_workspace.deleted_at').where('user_workspace.workspace_id', workspace_id)
  }

  async createUser(name: string, email: string, password: string): Promise<any> {
    const salt = await bcrypt.genSalt(10)
    await User.query().insert({
      uuid: Helpers.alphaHash(),
      name: name,
      email: email,
      password: await bcrypt.hash(password, salt)
    })
    return
  }

  async register(name: string, email: string, password: string): Promise<any> {
    try {
      const userExist = await this.getUserByEmail(email)
      if (userExist) {
        return Helpers.formatResponse(422, false, 'User already exist!')
      }

      await this.createUser(name, email, password)
      return Helpers.formatResponse(200, true, 'User register success!')
    } catch (err) {
      return Helpers.formatResponse(400, false, 'User register failed!', err.data)
    }
  }

  async login(email, password) {
    try {
      const userExist = await this.getUserByEmail(email)
      if (!userExist) {
        return Helpers.formatResponse(400, false, 'Invalid User credentials!')
      }

      if (await bcrypt.compare(password, userExist.password)) {
        const token = await jwt.sign({
          user_id: userExist.id,
          user_uuid: userExist.uuid,
          email
        }, process.env.JWT_TOKEN_KEY, { expiresIn: '200h' })

        await User.query()
          .findById(userExist.id)
          .patch({
            token: token
          })
        return Helpers.formatResponse(200, true, 'User login success!', { token: token })
      } else {
        if (userExist.source === 'google') {
          return Helpers.formatResponse(400, false, 'Please use sign in with google!')
        } else {
          return Helpers.formatResponse(400, false, 'Invalid User credentials!')
        }
      }
    } catch (err) {
      console.log(err)
      return Helpers.formatResponse(400, false, 'User login failed!', err)
    }
  }

  async forgotPassword(email: string): Promise<any> {
    const userExist = await this.getUserByEmail(email)
    if (!userExist) {
      return Helpers.formatResponse(400, false, 'Please check your register email to reset password!')
    }

    const uuid = userExist.uuid
    const token = await jwt.sign({
      user_uuid: uuid,
      email
    }, process.env.JWT_TOKEN_KEY, { expiresIn: '365d' })

    await User.query()
      .findById(userExist.id)
      .patch({
        reset_password_token: token
      })

    const URL = process.env.BASE_URL + '/user/reset-password/' + uuid + '/' + token
    return Helpers.formatResponse(200, true, 'Reset password!', { url: URL, uuid, token })
  }

  async updatePassword(uuid: string, token: string, password: string): Promise<any> {
    const uuidExists = await this.getUserByUUID(uuid)
    if (!uuidExists) return Helpers.formatResponse(400, false, 'Invalid url!')

    if (uuidExists.reset_password_token !== token) {
      return Helpers.formatResponse(400, false, 'Invalid url!')
    }

    const salt = await bcrypt.genSalt(10)
    await User.query()
      .findById(uuidExists.id)
      .patch({
        password: await bcrypt.hash(password, salt),
        reset_password_token: null
      })

    return Helpers.formatResponse(200, true, 'Password reset!')
  }

  async googleSignIn(code: string): Promise<any> {
    const details = await this.getGoogleUserInfo(code)
    /* const data = await this.getAccessTokenFromCode(code)
    console.log("dta",data)
    if(data['status'] === 'success') {
      const details = await this.getGoogleUserInfo(data['data'].access_token)
      if(details || details['email']) {
        const user = await this.getUserByEmail(details['email']);
        let token;
        if(user) {
           token = await jwt.sign({
            user_id: user.id,
            user_uuid: user.uuid,
            email: user.email
          }, process.env.JWT_TOKEN_KEY, {expiresIn: '365d'})
          if(user.source === 'web') {
            User.query()
              .findById(user.id)
              .patch({
                source_id: details['id'],
                source_json: details,
                token: token
              })
          }
        } else {
          const user = await User.query().insert({
            uuid: Helpers.alphaHash(),
            name: details['name'],
            email: details['email'],
            source_id: details['id'],
            source_json: details,
            source: 'google'
          })

           token = await jwt.sign({
            user_id: user.id,
            user_uuid: user.uuid,
            email: user.email
          }, process.env.JWT_TOKEN_KEY, {expiresIn: '365d'})
          await User.query()
                    .findById(user.id)
                    .patch({
                      token: token
                    })

        }
        return Helpers.formatResponse(200, true, 'User login success!', {token: token})
      } else {
        return Helpers.formatResponse(400, false, "Email missing!")
      }
    } else {
      return Helpers.formatResponse(400, false, data['message'])
    } */
    if (details || details['email']) {
      // Chaking databse from existing user
      const user = await this.getUserByEmail(details['email']);
      let token;
      if (user) {
        token = await jwt.sign({
          user_id: user.id,
          user_uuid: user.uuid,
          email: user.email
        }, process.env.JWT_TOKEN_KEY, { expiresIn: '365d' })
        console.log(token + "inside user_service.ts")
        if (user.source === 'web') {
          User.query()
            .findById(user.id)
            .patch({
              source_id: details['id'],
              source_json: details,
              token: token
            })
        }
      }
      // If user dose not exist create new user
      else {
        const user = await User.query().insert({
          uuid: Helpers.alphaHash(),
          name: details['name'],
          email: details['email'],
          source_id: details['id'],
          source_json: details,
          source: 'google'
        })

        token = await jwt.sign({
          user_id: user.id,
          user_uuid: user.uuid,
          email: user.email
        }, process.env.JWT_TOKEN_KEY, { expiresIn: '365d' })
        await User.query()
          .findById(user.id)
          .patch({
            token: token
          })

      }
      return Helpers.formatResponse(200, true, 'User login success!', { token: token })
    } else {
      return Helpers.formatResponse(400, false, "Email missing!")
    }
  }

  async getAccessTokenFromCode(code: string): Promise<object> {
    console.log("code", code)
    const body = {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_SECRET_KEY,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code',
      code,
    }
    const bodystring = queryString.stringify(body)
    const response = await Axios.post(`https://oauth2.googleapis.com/token`,
      bodystring, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).catch(e => {
      return { status: 'error', message: e.message }
    })

    if (response['data']) {
      return { status: 'success', data: response['data'] }
    }
    return { status: 'error', message: response['message'] }
  }

  async getGoogleUserInfo(access_token): Promise<object> {
    const { data } = await Axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    // { id, email, given_name, family_name }
    return data
  }

}