import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt'

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  it('/auth/register (POST) - should register a new user', async () => {
    const userPayload = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(userPayload)
      .expect(201);
      
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data.firstName).toEqual(userPayload.firstName);
    expect(response.body.data.email).toEqual(userPayload.email);
  });

  it('/auth/login (POST) - should login an existing user', async () => {
    const userPayload = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    await request(app.getHttpServer())
      .post('/users')
      .send(userPayload)
      .expect(201);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({email: userPayload.email, password: userPayload.password})
      .expect(200);

    expect(response.body.data).toHaveProperty('access_token');
  });

  it('/users (GET) - should fetch all users', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(Array.isArray(response.body.data)).toBe(true);
  });
});
