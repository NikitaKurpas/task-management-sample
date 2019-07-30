import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import config from 'config';
import { JwtPayload, ReqUser } from './auth.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('jwtSecret'),
    });
  }

  // noinspection JSMethodCanBeStatic
  async validate(payload: JwtPayload): Promise<ReqUser> {
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      admin: payload.admin,
    };
  }
}
