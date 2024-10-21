import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Abasiodiong',
    description: 'The first name of the user.',
    required: true,
  })
  @IsNotEmpty({ message: 'First name must not be empty.' })
  @IsString({ message: 'First name must be a string.' })
  firstName: string;

  @ApiProperty({
    example: 'Udofia',
    description: 'The last name of the user.',
    required: true,
  })
  @IsNotEmpty({ message: 'Last name must not be empty.' })
  @IsString({ message: 'Last name must be a string.' })
  lastName: string;

  @ApiProperty({
    example: 'enalsy22@gmail.com',
    description: 'The email address of the user.',
    required: true,
  })
  @IsNotEmpty({ message: 'Email must not be empty.' })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password for the user account.',
    required: true,
  })
  @IsNotEmpty({ message: 'Password must not be empty.' })
  @IsString({ message: 'Password must be a string.' })
  password: string;
}
