import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { makeMockUser } from '../../test/utils/generators';

let makeAuthServiceMock = (): Partial<AuthService> => ({
  login: jest.fn(),
});
let makeUserServiceMock = (): Partial<UserService> => ({
  create: jest.fn(),
});
const mockUser = makeMockUser();

describe('Auth Controller', () => {
  let controller: AuthController;
  let authService: AuthService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UserService],
    })
      .overrideProvider(AuthService)
      .useValue(makeAuthServiceMock())
      .overrideProvider(UserService)
      .useValue(makeUserServiceMock())
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    userService = module.get(UserService);
  });

  it('#login should generate token for the user', async () => {
    const mockReqUser = {
      id: mockUser.id,
      email: mockUser.email,
      admin: mockUser.role === 'administrator',
      name: mockUser.name,
    };

    jest
      .spyOn(authService, 'login')
      .mockImplementationOnce(async () => ({ token: 'access.token' }));

    expect(await controller.login({ user: mockReqUser })).toEqual({
      token: 'access.token',
    });
    expect(authService.login).toHaveBeenCalledWith(mockReqUser);
  });

  it('#register should create the user', async () => {
    const body = {
      email: mockUser.email,
      name: mockUser.name,
      password: 'h4x0r',
    };

    jest
      .spyOn(userService, 'create')
      .mockImplementationOnce(async () => mockUser);

    expect(await controller.register(body)).toBeUndefined();
    expect(userService.create).toHaveBeenCalledWith(body);
  });
});
