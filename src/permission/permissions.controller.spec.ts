import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { NotFoundException } from '@nestjs/common';

describe('PermissionsService', () => {
  let service: PermissionsService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: PrismaService,
          useValue: {
            permission: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
            },
            role: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a permission', async () => {
    const createPermissionDto: CreatePermissionDto = { name: 'read' };
    const createdPermission = {
      id: 'permission-id',
      name: 'READ',
    };

    jest
      .spyOn(prisma.permission, 'create')
      .mockResolvedValue(createdPermission);

    const result = await service.create(createPermissionDto);

    expect(result).toEqual(createdPermission);
    expect(prisma.permission.create).toHaveBeenCalledWith({
      data: { name: 'READ' },
    });
  });

  it('should fetch all permissions', async () => {
    const permissions = [
      { id: '1', name: 'READ' },
      { id: '2', name: 'WRITE' },
    ];

    jest.spyOn(prisma.permission, 'findMany').mockResolvedValue(permissions);

    const result = await service.findAll();

    expect(result).toEqual(permissions);
    expect(prisma.permission.findMany).toHaveBeenCalled();
  });

  it('should throw NotFoundException if the permission does not exist', async () => {
    const permissionId = 'non-existent-permission-id';
    const roleId = 'role-id';

    jest.spyOn(prisma.permission, 'findUnique').mockResolvedValue(null);

    await expect(
      service.assignPermissionToRole(permissionId, roleId),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if the role does not exist', async () => {
    const permissionId = 'permission-id';
    const roleId = 'non-existent-role-id';
    const permission = { id: permissionId, name: 'READ' };

    jest.spyOn(prisma.permission, 'findUnique').mockResolvedValue(permission);
    jest.spyOn(prisma.role, 'findUnique').mockResolvedValue(null);

    await expect(
      service.assignPermissionToRole(permissionId, roleId),
    ).rejects.toThrow(NotFoundException);
  });
});
