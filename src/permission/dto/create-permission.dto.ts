import { IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({
    example: 'READ',
    description:
      'The permission name. Must be one of: READ, WRITE, UPDATE, DELETE.',
    required: true,
  })
  @IsNotEmpty({ message: 'Permission name must not be empty.' })
  @IsIn(['READ', 'WRITE', 'UPDATE', 'DELETE'], {
    message: 'Permission must be one of: READ, WRITE, UPDATE, DELETE.',
  })
  name: string;
}
