import { RolesGuard } from './roles.guard';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';
import { TestController } from '../test/utils/test.controller';
import request from 'supertest';
import { adminToken, userToken } from '../test/utils/tokens';

describe('RolesGuard', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [TestController],
      providers: [RolesGuard, JwtStrategy],
    }).compile();

    app = module.createNestApplication();

    await app.init();
  });

  it('should allow access to unprotected routes', async () => {
    return request(app.getHttpServer())
      .get('/unprotected')
      .expect(200, 'Admin access not required');
  });

  it('should not allow access to protected routes for unauthenticated users', async () => {
    return request(app.getHttpServer())
      .get('/protected')
      .expect(401);
  });

  it('should not allow access to protected routes for unauthorised users', async () => {
    return request(app.getHttpServer())
      .get('/protected')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(403);
  });

  it('should allow access to protected routes for authorised users', async () => {
    return request(app.getHttpServer())
      .get('/protected')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200, 'Admin access required');
  });
});
