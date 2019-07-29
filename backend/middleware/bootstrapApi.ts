import 'reflect-metadata'
import { NextHandler } from '../../types/common'
import { Connection, createConnection } from 'typeorm'
import config from 'config'
import { container } from 'tsyringe'
import { createNamespace } from 'continuation-local-storage'

const session = createNamespace('__task_manager_cls_namespace__')

let __bootstrapPromise: Promise<void> | null = null

const bootstrapApi = (handler: NextHandler): NextHandler => (req, res) => {
  if (__bootstrapPromise === null) {
    // Stuff that must run only once during app startup
    __bootstrapPromise = (async () => {
      const connection = await createConnection({
        type: 'postgres',
        host: config.get<string>('db.host') || 'db',
        port: config.get<number>('db.port') || 5432,
        username: config.get<string>('db.username') || 'postgres',
        password: config.get<string>('db.password') || '',
        database: config.get<string>('db.database') || 'task_management_db',
        entities: [],
        synchronize: process.env.NODE_ENV === 'development',
      })
      container.registerInstance(Connection, connection)
    })()
  }

  __bootstrapPromise
    .then(() => session.run(() => {
      session.set('__current_request', req)
      handler(req, res)
    }))
}

export const getCurrentRequest = () => session.get('__current_request')

export default bootstrapApi
