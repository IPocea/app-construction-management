export class CreateUserDto {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  website?: string;
  role?: string;
  isTemporary?: boolean;
  roleType?: string;
}
