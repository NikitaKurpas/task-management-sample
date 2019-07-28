declare module 'micro-jwt-auth' {
  import { NextHandler } from './common'

  export default (secret: string) => (handler: NextHandler) => NextHandler
}
