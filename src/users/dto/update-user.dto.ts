import { IsEmail, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Abasiodiong',
    description: 'The updated first name of the user. Optional field.',
  })
  @IsOptional()
  @IsString({ message: 'First name must be a string.' })
  firstName?: string;

  @ApiProperty({
    example: 'Udofia',
    description: 'The updated last name of the user. Optional field.',
  })
  @IsOptional()
  @IsString({ message: 'Last name must be a string.' })
  lastName?: string;

  @ApiProperty({
    example: 'enalsy22@gmail.com',
    description: 'The updated email address of the user. Optional field.',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  email?: string;
}
