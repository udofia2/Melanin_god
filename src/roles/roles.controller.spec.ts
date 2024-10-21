import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { PrismaService } from '../prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { NotFoundException } from '@nestjs/common';

describe('RolesService', () => {
  let service: RolesService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RolesService, PrismaService],
    }).compile();

    service = module.get<RolesService>(RolesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a role', async () => {
    const permissions = [{ 
      id: faker.database.mongodbObjectId(),
      name: 'READ'

    },
    {
      id: faker.database.mongodbObjectId(),
      name: 'READ'

    }
  ]
    const fakeRole = {
      id: faker.database.mongodbObjectId(),
      name: faker.word.verb(),
      permissions,
      createdAt: new Date()
    };

    jest.spyOn(prisma.permission, 'findMany').mockResolvedValue(permissions);

    jest.spyOn(prisma.role, 'create').mockResolvedValue(fakeRole);

    const createdRole = await service.createRole({
      name: fakeRole.name,  
      permissions: [fakeRole.permissions[0].id, fakeRole.permissions[1].id],
    });

    expect(createdRole).toHaveProperty('id');
    expect(createdRole.name).toEqual(fakeRole.name);
  });

  it('should fetch all roles', async () => {
    const fakeRoles = Array(3)
      .fill(null)
      .map(() => ({
        id: faker.database.mongodbObjectId(),
        name: faker.word.verb(),
        permissions: ['READ', 'WRITE'],
      }));

    jest.spyOn(prisma.role, 'findMany').mockResolvedValue(fakeRoles);

    const roles = await service.findAll();
    expect(roles.length).toBe(3);
  });

  it('should fetch a role by ID', async () => {
    const fakeRole = {
      id: faker.database.mongodbObjectId(),
      name: faker.word.verb(),
      permissions: ['READ', 'WRITE'],
    };

    jest.spyOn(prisma.role, 'findUnique').mockResolvedValue(fakeRole);

    const role = await service.findOne(fakeRole.id);
    expect(role).toHaveProperty('id', fakeRole.id);
  });

  it('should throw NotFoundException if role is not found', async () => {
    jest.spyOn(prisma.role, 'findUnique').mockResolvedValue(null);

    await expect(
      service.findOne(faker.database.mongodbObjectId()),
    ).rejects.toThrow(NotFoundException);
  });
});
