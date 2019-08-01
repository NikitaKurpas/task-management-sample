import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { makeMockUser } from '../../test/utils/generators';
import { ReqUser } from '../auth/auth.dto';

const makeMockUserService = (): Partial<UserService> => ({
  findAll: jest.fn(),
  findOne: jest.fn(),
  findOneByEmail: jest.fn(),
  create: jest.fn(),
  updateOne: jest.fn(),
});

const mockUsers = [makeMockUser(), makeMockUser()];

describe('User Controller', () => {
  let controller: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    })
      .overrideProvider(UserService)
      .useValue(makeMockUserService())
      .compile();

    controller = module.get(UserController);
    userService = module.get(UserService);
  });

  it('should return an array of users', async () => {
    jest
      .spyOn(userService, 'findAll')
      .mockImplementationOnce(async () => mockUsers);

    expect(await controller.getUsers()).toBe(mockUsers);
  });

  it('should return the currently logged in user', async () => {
    const mockRequestUser: Partial<ReqUser> = {
      id: mockUsers[0].id,
    };
    const mockRequest = {
      user: mockRequestUser,
    };
    jest
      .spyOn(userService, 'findOne')
      .mockImplementationOnce(async () => mockUsers[0]);

    expect(await controller.getProfile(mockRequest)).toBe(mockUsers[0]);
    expect(userService.findOne).toHaveBeenCalledWith(mockRequest.user.id);
  });

  it('should update the currently logged in user', async () => {
    const mockRequestUser: Partial<ReqUser> = {
      id: mockUsers[0].id,
    };
    const mockRequest = {
      user: mockRequestUser,
    };
    const body = {
      name: 'New user name',
    };
    jest
      .spyOn(userService, 'findOne')
      .mockImplementationOnce(async () => mockUsers[0]);

    expect(await controller.updateProfile(mockRequest, body)).toBeUndefined();
    expect(userService.updateOne).toHaveBeenCalledWith(
      mockRequest.user.id,
      body,
    );
  });

  it('should return a user by their id', async () => {
    jest
      .spyOn(userService, 'findOne')
      .mockImplementationOnce(async () => mockUsers[0]);

    expect(await controller.getUserById(mockUsers[0].id)).toBe(mockUsers[0]);
    expect(userService.findOne).toHaveBeenCalledWith(mockUsers[0].id);
  });

  it('should update a user be their id', async () => {
    const body = {
      name: 'New user name',
    };

    expect(await controller.updateUserById(mockUsers[0].id, body)).toBeUndefined();
    expect(userService.updateOne).toHaveBeenCalledWith(mockUsers[0].id, body);
  });
});
