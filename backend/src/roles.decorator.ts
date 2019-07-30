import { SetMetadata } from '@nestjs/common';

export type Role = 'admin';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
