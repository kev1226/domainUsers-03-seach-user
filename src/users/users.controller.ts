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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('search')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Returns a user by numeric ID.
   * Admin role is required.
   */
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Find user by ID' })
  @ApiOkResponse({ type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.usersService.findOne(+id);
  }

  /**
   * Returns a user by email address (basic data).
   * Admin role is required.
   */
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Get('check/:email')
  @ApiOperation({ summary: 'Find user by email (basic)' })
  @ApiOkResponse({ type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findOneByEmail(@Param('email') email: string) {
    return this.usersService.findOneByEmail(email);
  }

  /**
   * Returns a user by email address, including password field.
   * This is intended for authentication logic.
   * Admin role is required.
   */
  @UseGuards(AuthGuard)
  @Roles(Role.ADMIN)
  @Get('login/:email')
  @ApiOperation({ summary: 'Find user by email including password' })
  @ApiOkResponse({ type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  findByEmailWithPassword(@Param('email') email: string) {
    return this.usersService.findByEmailWithPassword(email);
  }
}
