import { IJwtTokenPayload } from '../../../common/types/common'

export class ReqUser {
  readonly id: string;
  readonly email: string;
  readonly name?: string;
  readonly admin: boolean;
}

export class JwtPayload implements IJwtTokenPayload {
  readonly sub: string;
  readonly name?: string;
  readonly email: string;
  readonly admin: boolean;
}
