import { Permission } from '../permission/entities/permission.entity';

export class Role {
  id: string;
  name: string;
  permissions: Permission[];
}
