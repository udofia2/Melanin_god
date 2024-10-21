import { Controller, Post, Body, UseGuards, UsePipes, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UsersService } from '../users/users.service';
import { ValidationPipe } from '../common/pipes/validation.pipe';
import {
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
} from '@nestjs/swagger';
import { PermissionsGuard } from './guards/permissions.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { LoginDto } from './dto/login.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { AssignRoleResponseDto } from './dto/assign-role-response.dto';
import { UserResponseDto } from '../users/dto/response-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Endpoint for user registration.',
  })
  @ApiBody({
    description: 'User registration data',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully.',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data provided.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed: email must be a valid email',
        error: 'Bad Request',
      },
    },
  })
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);
    return {
      status: true,
      message: 'Registration successful.',
      data: user,
    };
  }

  @Post('login')
  @HttpCode(200)
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: 'Authenticate a user and return a JWT token.',
    description: 'Endpoint for logging in an existing user.',
  })
  @ApiResponse({
    status: 200,
    description: 'User logged in successfully.',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Invalid email or password',
        error: 'Unauthorized',
      },
    },
  })
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    return {
      status: true,
      message: 'login successful.',
      data: token,
    };
  }

  @Post('assign-role')
  @UseGuards(JwtAuthGuard, RolesGuard, PermissionsGuard)
  @UsePipes(ValidationPipe)
  @Permissions('WRITE')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Assign a role to a user',
    description: 'Endpoint for assigning roles to users by admin.',
  })
  @ApiResponse({
    status: 200,
    description: 'Role assigned successfully.',
    type: AssignRoleResponseDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden. Insufficient permissions.',
  })
  @ApiResponse({
    status: 404,
    description: 'User or role not found.',
  })
  @ApiResponse({ status: 404, description: 'User or role not found.' })
  async assignRole(@Body() assignRoleDto: AssignRoleDto) {
    const assignedRole = await this.usersService.assignRole(
      assignRoleDto.userId,
      assignRoleDto.roleId,
    );

    return {
      status: true,
      message: 'Role assigned successfully.',
      data: new UserResponseDto(assignedRole),
    };
  }
}
