import { IsArray, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    type: String,
    example: 'admin',
    description:
      'The role name, which can be either "admin" or "user" or any role. ',
  })
  @IsNotEmpty()
  @IsString()
  // @IsIn(['admin', 'user'])
  name: string;

  @ApiProperty({
    type: [String],
    example: [
      '2d2af737-5846-4c17-aa72-a621ca98fa68',
      '53b11c3c-8e82-495a-a81d-514a2c13f056',
    ],
    description: 'Array of permission IDs associated with the role.',
  })
  @IsArray()
  @IsNotEmpty()
  permissions: string[];
}
