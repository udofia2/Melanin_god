import { IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignPermissionDto {
  @ApiProperty({
    example: 'b41bf6e1-0fc8-4fb1-a87d-ec8c6d713400',
    description: 'Permission Id',
    required: true,
  })
  @IsNotEmpty({ message: 'Permission Id must not be empty.' })
  permissionId: string;
  @ApiProperty({
    example: 'b41bf6e1-0fc8-4fb1-a87d-ec8c6d713400',
    description: 'Role Id',
    required: true,
  })
  @IsNotEmpty({ message: 'Role Id must not be empty.' })
  roleId: string;
}
