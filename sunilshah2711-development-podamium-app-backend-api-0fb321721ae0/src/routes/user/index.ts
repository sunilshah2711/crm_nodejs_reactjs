import express, { Request, Response } from 'express'
const userRoute = express.Router()
import { UserController } from '../../controllers/UserContoller'
import { Container } from 'typedi'
import { UserSchema } from '../../schema/user/userSchema'
import { Auth } from '../../middleware/Auth'
import { Workspace } from '../../middleware/Workspace'

const userController = Container.get(UserController)
const userSchema = Container.get(UserSchema)
const auth = Container.get(Auth)
const workspace = Container.get(Workspace);

userRoute.get('/ping', (req: Request, res: Response) => {
  res.send('OK')
})

userRoute.get('/test', (req: Request, res: Response) => {
  res.send('first api')
})

userRoute.post('/user/create', userSchema.validateRegisterRequest, (req: Request, res: Response) => {
  return userController.register(req, res)
})

userRoute.post('/user/login', userSchema.validateLoginRequest, (req: Request, res: Response) => {
  console.log("hello insde index.ts post")
  return userController.login(req, res)
})

userRoute.get('/user/login', userSchema.validateLoginRequest, (req: Request, res: Response) => {
  console.log("hello insde index.ts changing post to get")
  return userController.login(req, res)
})

userRoute.post('/user/forgot-password', userSchema.validateResetPassRequest, (req: Request, res: Response) => {
  return userController.forgotPassword(req, res)
})

userRoute.post('/user/forgot-password/:uuid/:token', userSchema.validateUpdatePassRequest, (req: Request, res: Response) => {
  return userController.updatePassword(req, res)
})

userRoute.get('/user/home', auth.validateToken, (req: Request, res: Response) => {
  return res.send('User Home')
})

userRoute.get('/:workspaceId/user/users-list', [auth.validateToken, workspace.userHasWorkspacePermission], (req: Request, res: Response) => {
  return userController.getUsersList(req, res)
})


export { userRoute }