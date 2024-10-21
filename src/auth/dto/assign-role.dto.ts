import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleDto {
  @ApiProperty({
    description:
      'The ID of the user to whom the role will be assigned. Must not be empty.',
    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479', 
  })
  @IsNotEmpty({ message: 'User ID must be provided.' })
  userId: string;

  @ApiProperty({
    description: 'The ID of the role to assign to the user. Must not be empty.',
    example: 'b44d3e9d-ff77-43e2-9e5e-df6f9f65a4f0', 
  })
  @IsNotEmpty({ message: 'Role ID must be provided.' })
  roleId: string;
}
