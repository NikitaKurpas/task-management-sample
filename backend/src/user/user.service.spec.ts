import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity'
import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { makeMockUser } from '../../test/utils/generators'
import bcrypt from 'bcryptjs';
import { ConflictException, NotFoundException } from '@nestjs/common'

const makeMockRepository = (): Partial<Repository<User>> => ({
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn()
})

const mockUsers = [makeMockUser(), makeMockUser()]

describe('UserService', () => {
  let service: UserService;
  let userRepository: Repository<User>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, {
        provide: getRepositoryToken(User),
        useValue: makeMockRepository()
      }],
    })
      .compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User))
  });

  it('#findAll should return all users', async () => {
    jest.spyOn(userRepository, 'find')
      .mockImplementationOnce(async () => mockUsers)

    expect(await service.findAll()).toBe(mockUsers)
  })

  it('#findOne should find a user by id', async () => {
    jest.spyOn(userRepository, 'findOne')
      .mockImplementationOnce(async () => mockUsers[0])

    expect(await service.findOne(mockUsers[0].id)).toBe(mockUsers[0])
    expect(userRepository.findOne).toHaveBeenCalledWith(mockUsers[0].id)
  })

  it('#findOne should throw a NotFound exception if the user is not found', async () => {
    jest.spyOn(userRepository, 'findOne')
      .mockImplementationOnce(async () => undefined)

    await expect(service.findOne(mockUsers[0].id)).rejects.toBeInstanceOf(NotFoundException)
    expect(userRepository.findOne).toHaveBeenCalledWith(mockUsers[0].id)
  })

  it('#findOneByEmail should find a user by email', async () => {
    jest.spyOn(userRepository, 'findOne')
      .mockImplementationOnce(async () => mockUsers[0])

    expect(await service.findOneByEmail(mockUsers[0].email)).toBe(mockUsers[0])
    expect(userRepository.findOne).toHaveBeenCalledWith({ email: mockUsers[0].email })
  })

  it('#findOneByEmail should throw a NotFound exception if the user is not found', async () => {
    jest.spyOn(userRepository, 'findOne')
      .mockImplementationOnce(async () => undefined)

    await expect(service.findOneByEmail(mockUsers[0].email)).rejects.toBeInstanceOf(NotFoundException)
    expect(userRepository.findOne).toHaveBeenCalledWith({ email: mockUsers[0].email })
  })

  it('#create should save a new user and hash the password', async () => {
    const genSaltSpy = jest.spyOn(bcrypt, 'genSalt')
    const hashSpy = jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => '5up3rh45h')

    jest.spyOn(userRepository, 'save').mockImplementationOnce(async (user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      passwordHash: user.passwordHash,
      role: user.role,
      createdAt: new Date(),
    }))

    const createUserDto = {
      email: mockUsers[0].email,
      name: mockUsers[0].name,
      password: 'supersecret'
    }

    const expectedUserModel = {
      id: expect.any(String),
      name: mockUsers[0].name,
      email: mockUsers[0].email,
      passwordHash: '5up3rh45h',
      role: 'user',
    }

    expect(await service.create(createUserDto)).toEqual({
      ...expectedUserModel,
      createdAt: expect.any(Date)
    })
    expect(userRepository.findOne).toHaveBeenCalledWith({ email: mockUsers[0].email })
    expect(genSaltSpy).toHaveBeenCalled()
    expect(hashSpy).toHaveBeenCalledWith('supersecret', expect.any(String))
    expect(userRepository.save).toHaveBeenCalledWith(expectedUserModel)
  })

  it('#create should not save a new user when another user with same email already exists', async () => {
    jest.spyOn(userRepository, "findOne").mockImplementationOnce(async () => mockUsers[0])

    const createUserDto = {
      email: mockUsers[0].email,
      name: mockUsers[0].name,
      password: 'supersecret'
    }

    await expect(service.create(createUserDto)).rejects.toBeInstanceOf(ConflictException)
    expect(userRepository.findOne).toHaveBeenCalledWith({ email: mockUsers[0].email })
    expect(userRepository.save).not.toHaveBeenCalled()
  })

  it('#updateOne should return the updated user ', async () => {
    const fields = {
      name: 'New user name'
    }

    const expected = {
      ...mockUsers[0],
      ...fields
    }

    jest.spyOn(userRepository, 'findOne')
      .mockImplementationOnce(async () => mockUsers[0])
    jest.spyOn(userRepository, 'save')
      .mockImplementationOnce(async () => expected)

    expect(await service.updateOne(mockUsers[0].id, { name: 'New user name'})).toEqual(expected)
    expect(userRepository.findOne).toHaveBeenCalledWith(mockUsers[0].id)
    expect(userRepository.save).toHaveBeenCalledWith(expected)
  })

  it('#updateOne should throw NotFound exception when user is not found', async () => {
    jest.spyOn(userRepository, 'findOne')
      .mockImplementationOnce(async () => undefined)

    await expect(service.updateOne(mockUsers[0].id, { name: 'New user name'})).rejects.toBeInstanceOf(NotFoundException)
    expect(userRepository.findOne).toHaveBeenCalledWith(mockUsers[0].id)
    expect(userRepository.save).not.toHaveBeenCalled()
  })
});
