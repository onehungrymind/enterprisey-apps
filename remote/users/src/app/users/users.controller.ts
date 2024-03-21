import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { User } from '../database/entities/user.entity';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/role.decorator';

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

  @Get('email/:email')
  @Role(['admin'])
  @UseGuards(JwtAuthGuard)
  findByEmail(@Param('email') email: string): Promise<User> {
    return this.usersService.findByEmail(email);
  }

  @Post()
  @Role(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() user: User): Promise<User> {
    return this.usersService.create(user);
  }

  @Get()
  @Role(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Role(['user'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Role(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() user: User) {
    return this.usersService.update(user);
  }

  @Delete(':id')
  @Role(['admin'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
