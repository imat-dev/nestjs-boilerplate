import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuardLocal } from './guards/auth.guard.local';
import { CurrentUser } from '../common/decorators/requests/current-user.decorator';
import { User } from './../model/users/user.entity';
import { AuthService } from './auth.service';
import { AuthenticatedUser } from './guards/auth.guard.jwt';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user: User) {
    return {
      email: user.email,
      token: await this.authService.generateToken(user),
    };
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.register(createUserDto);

    return {
      email: user.email,
      token: await this.authService.generateToken(user),
    };
  }

  @Get('me')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthenticatedUser)
  async getProfile(@CurrentUser() user: User) {
    return user;
  }
}
