import { UnauthorizedException } from '@nestjs/common';

export function checkRoleForAccess(role: string, acceptedRoles: string[]): void {
  if (!acceptedRoles.includes(role)) {
    throw new UnauthorizedException(
      `The role ${role} does not have access to this route`
    );
  }
}
