import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should register a user', async () => {
    const password = faker.internet.password();
    const hashedPassword = await bcrypt.hash(password, 10);

    const createUserDto = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password,
    };

    const userData = {
      ...createUserDto,
      createdAt: new Date(),
      passwordHash: hashedPassword,
      id: faker.database.mongodbObjectId(),
    };

    jest
      .spyOn(usersService, 'create')
      .mockResolvedValue(userData);

    const user = await authService.register(createUserDto);

    expect(user).toEqual(userData);

    expect(usersService.create).toHaveBeenCalledWith(createUserDto);
  });

  it('should login a user and return a token', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const passwordHash = await bcrypt.hash(password, 10);

    const fakeUser = {
      id: faker.database.mongodbObjectId(),
      email,
      passwordHash,
      roles: [],
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      createdAt: new Date(),
    };

    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(fakeUser);

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    jest
      .spyOn(jwtService, 'sign')
      .mockReturnValue(faker.database.mongodbObjectId());

    const result = await authService.login(email, password);

    expect(result).toHaveProperty('access_token');
    expect(usersService.findByEmail).toHaveBeenCalledWith(email);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      password,
      fakeUser.passwordHash,
    );
  });

  it('should throw UnauthorizedException if user is not found during login', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();

    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

    await expect(authService.login(email, password)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const passwordHash = await bcrypt.hash(password, 10);

    const fakeUser = {
      id: faker.database.mongodbObjectId(),
      email,
      passwordHash,
      roles: [],
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      createdAt: new Date(),
    };

    jest.spyOn(usersService, 'findByEmail').mockResolvedValue(fakeUser);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await expect(authService.login(email, password)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
