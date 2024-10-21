import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({
    type: String,
    description: 'User unique id',
    example: {
      id: '2d2af737-5846-4c17-aa72-a621ca98fa68',
    },
  })
  id: string;
  
  @ApiProperty({
    type: String,
    description: 'User Email',
    example: {
      email: 'user@example.com',
    },
  })
  email: string;
  
  @ApiProperty({
    type: String,
    description: 'User Assigned Roles',
    example: {
      roles: [],
    },
  })
  roles: string[];

  @ApiProperty({
    type: String,
    description: 'User hashed password',
    example: {
      passwordHash:
        '$2b$10$k20.WGikpasLn4/NIoXuYeAjilkv6ajoFRYsvMc96QAU7SB.Ewy8q',
    },
  })
  passwordHash: string[];

  @ApiProperty({
    type: String,
    description: 'User hashed password',
    example: {
      createdAt: "2024-10-21T05:18:53.352Z",
    },
  })
  createdAt: Date
}

