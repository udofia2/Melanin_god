import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a user', async () => {
    const password = faker.internet.password();
    const hashedPassword = await bcrypt.hash(password, 10);

    const fakeUser = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password,
      passwordHash: hashedPassword,
    };

    jest.spyOn(prisma.user, 'create').mockResolvedValue({
      id: faker.database.mongodbObjectId(),
      ...fakeUser,
      createdAt: new Date(),
    });

    const createdUser = await service.create({
      firstName: fakeUser.firstName,
      lastName: fakeUser.lastName,
      email: fakeUser.email,
      password,
    });

    expect(createdUser).toHaveProperty('id');
    expect(createdUser.firstName).toEqual(fakeUser.firstName);
    expect(createdUser.email).toEqual(fakeUser.email);
  });

  it('should fetch all users', async () => {
    const password = faker.internet.password();
    const hashedPassword = await bcrypt.hash(password, 10);

    const fakeUsers = Array(3)
      .fill(null)
      .map(() => ({
        id: faker.database.mongodbObjectId(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        passwordHash: hashedPassword,
        createdAt: new Date(),
      }));

    jest.spyOn(prisma.user, 'findMany').mockResolvedValue(fakeUsers);

    const users = await service.findAll();
    expect(users.length).toBe(3);
  });

  it('should fetch a user by id', async () => {
    const password = faker.internet.password();
    const hashedPassword = await bcrypt.hash(password, 10);
    const fakeUser = {
      id: faker.database.mongodbObjectId(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      passwordHash: hashedPassword,
      createdAt: new Date(),
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(fakeUser);

    const user = await service.findOne(fakeUser.id);
    expect(user).toHaveProperty('id');
    expect(user.id).toEqual(fakeUser.id);
  });

  it('should update a user', async () => {
    const password = faker.internet.password();
    const hashedPassword = await bcrypt.hash(password, 10);

    const fakeUser = {
      id: faker.database.mongodbObjectId(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      passwordHash: hashedPassword,
      createdAt: new Date(),
    };

    const updateUserDto = {
      firstName: faker.person.firstName(),
      email: faker.internet.email(),
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(fakeUser);

    jest.spyOn(prisma.user, 'update').mockResolvedValue({
      ...fakeUser,
      ...updateUserDto,
    });

    const updatedUser = await service.update(fakeUser.id, updateUserDto);
    expect(updatedUser.firstName).toEqual(updateUserDto.firstName);
    expect(updatedUser.email).toEqual(updateUserDto.email);
  });

  it('should delete a user', async () => {
    const password = faker.internet.password();
    const hashedPassword = await bcrypt.hash(password, 10);

    const fakeUser = {
      id: faker.database.mongodbObjectId(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      passwordHash: hashedPassword,
      createdAt: new Date(),
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(fakeUser);

    jest.spyOn(prisma.user, 'delete').mockResolvedValue(fakeUser);

    const result = await service.remove(fakeUser.id);
    expect(result).toEqual(undefined);
  });

  it('should throw NotFoundException if user is not found', async () => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    await expect(
      service.findOne(faker.database.mongodbObjectId()),
    ).rejects.toThrow(NotFoundException);
  });


  it('should throw NotFoundException if user does not exist', async () => {
    const userId = faker.database.mongodbObjectId();
    const roleId = faker.database.mongodbObjectId();

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    await expect(service.assignRole(userId, roleId)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw NotFoundException if role does not exist', async () => {
    const userId = faker.database.mongodbObjectId();
    const roleId = faker.database.mongodbObjectId();

    const fakeUser = {
      id: userId,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      passwordHash: await bcrypt.hash(faker.internet.password(), 10),
      createdAt: new Date(),
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(fakeUser);
    jest.spyOn(prisma.role, 'findUnique').mockResolvedValue(null);

    await expect(service.assignRole(userId, roleId)).rejects.toThrow(
      NotFoundException,
    );
  });
});
