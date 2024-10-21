import { Controller, Post, Body, Get, Param, UsePipes } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AssignPermissionDto } from './dto/asign-permission-dto'

@ApiTags('Permission')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'Create a new permission',
    description: 'Endpoint to create a new permission.',
  })
  @ApiResponse({ status: 201, description: 'Permission created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data provided.' })
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    const permission =
      await this.permissionsService.create(createPermissionDto);

    return {
      status: true,
      message: 'Permission created successfully.',
      data: permission,
    };
  }

  @Get()
  @ApiOperation({
    summary: 'Get all permissions',
    description: 'Endpoint to retrieve all permissions.',
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions retrieved successfully.',
  })
  async findAll() {
    const permissions = await this.permissionsService.findAll();

    return {
      status: true,
      message: 'Permissions retrieved successfully.',
      data: permissions,
    };
  }

  @Post('/assign')
  @ApiOperation({
    summary: 'Assign permission to role',
    description: 'Endpoint to assign a permission to a specific role.',
  })
  @ApiResponse({
    status: 200,
    description: 'Permission assigned to role successfully.',
  })
  @ApiResponse({ status: 404, description: 'Permission or role not found.' })
  async assignPermissionToRole(
    @Body() assignPermissionDto: AssignPermissionDto,
  ) {
    const assignPermission =
      await this.permissionsService.assignPermissionToRole(
        assignPermissionDto.permissionId,
        assignPermissionDto.roleId,
      );

    return {
      status: true,
      message: 'Permission assigned successfully.',
      data: assignPermission,
    };
  }
}
