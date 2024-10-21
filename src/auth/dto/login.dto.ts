import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'enalsy22@gmail.com',
    description: "The user's email address. Must be a valid email format.",
    required: true,
  })
  @IsNotEmpty({ message: 'Email must be provided.' })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: "The user's password. Must not be empty.",
    required: true,
  })
  @IsNotEmpty({ message: 'Password must be provided.' })
  @IsString({ message: 'Password must be a string.' })
  password: string;
}
