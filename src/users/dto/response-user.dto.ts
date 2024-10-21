import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class UserResponseDto {
  id: string;

  firstName: string;

  lastName: string;

  email: string;

  createdAt: Date;

  roles: {
    id: string;
    name: string;
  }[];

  @Exclude()
  passwordHash: string;
  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
