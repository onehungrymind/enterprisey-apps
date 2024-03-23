import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '../database/entities/user.entity';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { RolesGuard } from '@proto/lib/roles.guard';
import { Roles } from '@proto/lib/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @UseGuards(LocalAuthGuard)
  @UsePipes(new ValidationPipe())
  @Post('auth/login')
  async login(@Body() req: { email: string; password: string }) {
    return this.authService.login(req);
  }

  @Get('auth/validate')
  @UseGuards(JwtAuthGuard)
  validate(@Req() req: { user: { id: string } }) {
    return req.user;
  }

  @Get('email/:email')
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard)
  findByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findByEmail(email);
  }

  @Post()
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @Get()
  @Roles(['admin', 'tester'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(['user'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() user: User) {
    if (id !== user.id) {
      throw new Error('User id does not match');
    }
    return this.usersService.update(user);
  }

  @Delete(':id')
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
