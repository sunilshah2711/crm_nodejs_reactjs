import express, { NextFunction, Request, Response } from 'express'
import { json } from 'body-parser'
import dotenv from 'dotenv'
import 'express-async-errors'
import { router } from './routes/index'
import Knex from 'knex'
import { Model } from 'objection'
import cors from 'cors'
import { engine } from 'express-handlebars'

dotenv.config()

const limitedPoolEnvironment = ['develop', 'staging', 'test']
const config = {
    debug: false,
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        database: process.env.ENVIRONMENT == 'test' ? process.env.DB_DATABASE_TEST : process.env.DB_DATABASE,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
    pool: null,
}

if (limitedPoolEnvironment.includes(process.env.ENVIRONMENT)) {
    config.pool = { min: 1, max: 1 }
}

const knex = Knex(config)
Model.knex(knex)

const app = express()
app.use(json())
app.use(cors({ credentials: true, origin: true, exposedHeaders: '*' }))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With,x-access-token, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
})
app.set('view engine', 'handlebars');
app.engine('handlebars', engine());
app.use(express.static(__dirname + '/views'))

// Add your routes here
// Set your base url for the router
app.use('/v1', router)

app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(404);

    // respond with html page
    if (req.accepts('html')) {
        res.send({ error: 'URL not found' })
        return
    }

    // respond with json
    if (req.accepts('json')) {
        res.send({ error: 'URL not found' })
        return
    }

    // default to plain-text. send()
    res.type('txt').send({ error: 'URL not found' })
})

export { app }