import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new role',
    description: 'Endpoint to create a new role.',
  })
  @ApiResponse({ status: 201, description: 'Role created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data provided.' })
  async create(@Body() createRoleDto: CreateRoleDto) {
    const role = await this.rolesService.createRole(createRoleDto);

        return {
          status: true,
          message: 'Role created successfully.',
          data: role,
        };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all roles',
    description: 'Endpoint to retrieve all roles.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of roles retrieved successfully.',
  })
  async findAll() {
    const roles = await this.rolesService.findAll();

    return {
      status: true,
      message: 'Roles retrieved successfully.',
      data: roles,
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a role by ID',
    description: 'Endpoint to retrieve a role by its ID.',
  })
  @ApiResponse({ status: 200, description: 'Role retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Role not found.' })
  async findOne(@Param('id') id: string) {
    const role = await this.rolesService.findOne(id);

    return {
      status: true,
      message: 'Role retrieved successfully.',
      data: role,
    };
  }
}
