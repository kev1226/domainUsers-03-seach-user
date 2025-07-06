import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/rol.enum';

@Controller('search')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Get('check/:email')
  findOneByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }

  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Get('login/:email')
  findByEmailWithPassword(@Param('email') email: string) {
    return this.usersService.findByEmailWithPassword(email);
  }
}
