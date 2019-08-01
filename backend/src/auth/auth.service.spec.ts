import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import { makeMockUser } from '../../test/utils/generators';

const makeMockUserService = (): Partial<UserService> => ({
  findOneByEmail: jest.fn(),
});
const makeMockJwtService = (): Partial<JwtService> => ({
  signAsync: jest.fn(),
});

const mockUser = makeMockUser();

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService, JwtService],
    })
      .overrideProvider(UserService)
      .useValue(makeMockUserService())
      .overrideProvider(JwtService)
      .useValue(makeMockJwtService())
      .compile();

    service = module.get(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
  });

  it("validateUser should return the user without the password if user's email and password are correct", async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => true);
    jest
      .spyOn(userService, 'findOneByEmail')
      .mockImplementationOnce(async () => mockUser);

    expect(await service.validateUser(mockUser.email, 'supersecret')).toEqual({
      ...mockUser,
      passwordHash: undefined,
    });
    expect(userService.findOneByEmail).toHaveBeenCalledWith(mockUser.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      'supersecret',
      mockUser.passwordHash,
    );
  });

  it('validateUser should return null if user cannot be found', async () => {
    jest
      .spyOn(userService, 'findOneByEmail')
      .mockImplementationOnce(async () => undefined);
    expect(await service.validateUser(mockUser.email, 'supersecret')).toBeNull();
  });

  it("validateUser should return null if the passwords don't match", async () => {
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false);
    jest
      .spyOn(userService, 'findOneByEmail')
      .mockImplementationOnce(async () => mockUser);

    expect(await service.validateUser(mockUser.email, 'supersecret')).toBeNull();
  });

  it('login should generate a token for the user', async () => {
    jest.spyOn(jwtService, 'signAsync').mockImplementationOnce(async () => 'signed.token')
    expect(await service.login(mockUser)).toEqual({
      token: 'signed.token'
    })
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      admin: false
    })
  })
});
