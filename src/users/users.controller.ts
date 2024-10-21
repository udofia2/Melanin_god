import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserResponseDto } from './dto/response-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Permissions } from '../common/decorators/permissions.decorator';


@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Endpoint to create a new user.',
  })
  @ApiResponse({ status: 201, description: 'User created successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid data provided.' })
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);

    return {
      status: true,
      message: 'User created successfully.',
      data: newUser,
    };
  }

  @Get('')
  @ApiOperation({
    summary: 'Fetch all users with their roles',
    description: 'Endpoint to retrieve all users.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully.',
  })
  async findAll() {
    const users = await this.usersService.findAll();
    return {
      status: true,
      message: 'Users retrieved successfully.',
      data: users.map((user) => new UserResponseDto(user)),
    };
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'Endpoint to retrieve a user by their ID.',
  })
  @ApiResponse({ status: 200, description: 'User retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);

    return {
      status: true,
      message: 'User retrieved successfully.',
      data: new UserResponseDto(user),
    };
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a user',
    description: 'Endpoint to update a user by their ID.',
  })
  @ApiResponse({ status: 200, description: 'User updated successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const updatedUser = await this.usersService.update(id, updateUserDto);

    return {
      status: true,
      message: 'User updated successfully.',
      data: new UserResponseDto(updatedUser),
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @UsePipes(ValidationPipe)
  @Permissions('DELETE')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Admin-only endpoint to delete a user',
    description: 'Endpoint to delete a user by their ID.',
  })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { status: true, message: 'User deleted successfully.', data: [] };
  }
}
