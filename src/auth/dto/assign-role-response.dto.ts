import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleResponseDto {
  @ApiProperty({
    type: String,
    description: 'User unique Id',
    example: 'b41bf6e1-0fc8-4fb1-a87d-ec8c6d713400',
  })
  id: string;

  @ApiProperty({
    type: String,
    description: 'User first name',
    example: 'Abasiodiong',
  })
  firstName: string;

  @ApiProperty({
    type: String,
    description: 'User last name',
    example: 'Udofia',
  })
  lastName: string;

  @ApiProperty({
    type: String,
    description: 'User email address',
    example: 'enalsy22@gmail.com',
  })
  email: string;

  @ApiProperty({
    type: String,
    description: 'Date and time of event',
    example: '2024-10-21T05:18:53.352Z',
  })
  createdAt: Date;
}

