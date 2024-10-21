import { Role } from '../roles/role.entity'; 

export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  roles: Role[];
}
