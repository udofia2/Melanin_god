import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async createRole(createRoleDto: CreateRoleDto) {
    // Check if all permission IDs exist
    const permissions = await this.prisma.permission.findMany({
      where: {
        id: {
          in: createRoleDto.permissions,
        },
      },
    });

    const existingPermissionIds = permissions.map(
      (permission) => permission.id,
    );
    const missingPermissionIds = createRoleDto.permissions.filter(
      (id) => !existingPermissionIds.includes(id),
    );

    if (missingPermissionIds.length > 0) {
      throw new BadRequestException(
        `Invalid permission IDs: ${missingPermissionIds.join(', ')}`,
      );
    }

    return this.prisma.role.create({
      data: {
        name: createRoleDto.name.toLowerCase(),
        permissions: {
          connect: createRoleDto.permissions.map((permissionId) => ({
            id: permissionId,
          })),
        },
      },
    });
  }

  async findAll() {
    return this.prisma.role.findMany({ include: { permissions: true } });
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { permissions: true },
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found.`);
    }

    return role;
  }
}
