import 'reflect-metadata'
import { app } from './app'

const start = async () => {
  app.listen(process.env.PORT, () => {
    console.log('Listening on Port ' + process.env.PORT)
  })
}

start()
  .then(() => {
    console.log('Successfully started server ...')
  })
  .catch((error) => {
    throw error
  })
