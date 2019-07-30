export class ReqUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly admin: boolean;
}

export class JwtPayload {
  readonly sub: string;
  readonly name: string;
  readonly email: string;
  readonly admin: boolean;
}
