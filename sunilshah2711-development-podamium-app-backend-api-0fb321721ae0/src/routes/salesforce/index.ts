import express, { Request, Response } from 'express'
import * as nforce from 'nforce'

const salesforceRoute = express.Router()

const org = nforce.createConnection({
  clientId: '3MVG9pRzvMkjMb6kVAWgTTZIrJt2zxjKLP9nsNJAyX3wNWs3zZYGTuoVSQSIOqyRY0v9IKOR7uQcxRSEEX6lq',
  clientSecret: '50F7E4D7E72B64D2B7B41DC5FB55199CF4D395B5DB56CA2C3E9FE0F34418E5E0',
  redirectUri: 'http://localhost:3000/sales-force/oauth/authorization-callback',
  apiVersion: 'v44.0',
  environment: 'production',
  mode: 'multi',
  autoRefresh: true // <--- set this to true
})

salesforceRoute.get('/', (req: Request, res: Response) => {
  const url = org.getAuthUri()
  res.render('main', {layout : 'index', url:url})
})

salesforceRoute.get('/sales-force/oauth/authorization-callback',async (req: Request,res: Response) => {
  org.authenticate({ code: req.query.code }, function(err, resp){
    if(!err) {
      console.log(resp)
      console.log('Access Token: ' + resp.access_token)
      // oauth = resp
    } else {
      console.log('Error: ' + err.message)
    }
  })
  res.end("Here after redirected")
})

salesforceRoute.post('/sales-force/oauth/authorization-callback',(req: Request,res: Response) => {
  console.log("in post")
  console.log(req.body)
  console.log(req.query)
  res.end("Here after get callback")
})

salesforceRoute.get('/get-leads',(req: Request, res: Response) => {
  const oauth = {
    access_token: '00D5j00000AdvOe!AQsAQNi7jArX22nrDYuOHd1IRkN2REN6acUkLxz7na5UYfHbD3PH1n3WCj9HQuZV4.tKgvoNpZWB._i6hzhSloX1GYh0_QBU',
    refresh_token: '5Aep861mdLLi91HqFfBrAyacu1BHUazBruLGbjf35AI.31yoN5U_7SegfSaVcjt7LRQjN6pC0CEMP6mtP4DztxW',
    signature: 'aWBV9LGqoJMAanybIAb860RrtBIOnhpGDulI2al92Fg=',
    scope: 'lightning refresh_token web chatter_api api content',
    instance_url: 'https://filgo2-dev-ed.my.salesforce.com',
    id: 'https://login.salesforce.com/id/00D5j00000AdvOeEAJ/0055j000006Jf8yAAC',
    token_type: 'Bearer',
    issued_at: '1647747525536'
  }
  org.query({ query: 'SELECT Id, Name, CreatedDate, Email FROM Lead LIMIT 1', oauth: oauth }, function(err, records){
    if(err) throw err
    else {
      console.log('query completed with token: ' + oauth.access_token) // <--- if refreshed, this should be different
      res.send(records)
    }
  })
})

export {salesforceRoute}