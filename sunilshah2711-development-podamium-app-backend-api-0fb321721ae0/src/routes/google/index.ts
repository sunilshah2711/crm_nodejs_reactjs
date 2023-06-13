import express, { Request, Response } from 'express'
const googleRoute = express.Router()
import * as queryString from 'query-string'
import Axios from 'axios'
import { Helpers } from '../../helpers/Helpers'
import { UserController } from '../../controllers/UserContoller'
import { Container } from 'typedi'
import { UserSchema } from '../../schema/user/userSchema'

const userController = Container.get(UserController)
const userSchema = Container.get(UserSchema)

googleRoute.get('/login-with-google', (req: Request, res: Response) => {
  const stringifiedParams = queryString.stringify({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '), // space seperated string
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
  })
  const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
  res.render('google-login', { layout: 'index', url: googleLoginUrl })
})

/* googleRoute.get('/only-code', async function (req, res) {
 
  const code = '4/0AX4XfWgcLhbPi0dQWfPeXv7bHvO4A9YngI44Mg-guQA5d7CZnGxbZpgKtuRrBV8MqAHy5g';
  const data = await getAccessTokenFromCode(code);
  const details = await getGoogleUserInfo(data.data.access_token);
  res.send(details);
}) */
/* async (req: Request,res: Response) => {
  
  const code = req.body.code
  let response;
  if(code) {
    const data = await getAccessTokenFromCode(code)
    const details = await getGoogleUserInfo(data.data.access_token)
  } else{
    response = Helpers.formatResponse(200, true, 'Missing Data !', );
  }
  return res.status(response.status).send(response);
} */
googleRoute.post('/auth/google/signin-callback', userSchema.validateGoogleSigninRequest, (req: Request, res: Response) => {
  return userController.googleSignIn(req, res)
})

// Get auth code so that we can reqest access tokan

googleRoute.get('/auth/google/callback', async function (req: Request, res: Response) {
  //console.log(req.query)
  const code = req.query.code
  //const data = await getAccessTokenFromCode(code)
  //const details = await getGoogleUserInfo(data.data.access_token)
  //{"id":"103226845040663291808","email":"rjtech.upwork@gmail.com","verified_email":true,"name":"Rahul Jalavadiya","given_name":"Rahul","family_name":"Jalavadiya","picture":"https://lh3.googleusercontent.com/a/AATXAJzwQsUbmcx2F5Fuqovs9dQ46sZpOlMgUFKfk_Kb=s96-c","locale":"en"}

  res.send(code)
})

// Get acces Tokan From Google so that we can request user information using that tokan

async function getAccessTokenFromCode(code) {

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
    throw new Error(e.message)
  })
  return { status: 'success', data: response.data }
}

// After sucess full login get the user info

async function getGoogleUserInfo(access_token) {
  console.log(access_token)
  const { data } = await Axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
  // { id, email, given_name, family_name }
  return data
}

export { googleRoute }