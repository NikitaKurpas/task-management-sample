import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from '../../src/roles.decorator';
import { RolesGuard } from '../../src/roles.guard';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class TestController {
  @Get('protected')
  @Roles('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  protectedRoute() {
    return 'Admin access required';
  }

  @Get('unprotected')
  unprotectedRoute() {
    return 'Admin access not required';
  }
}
