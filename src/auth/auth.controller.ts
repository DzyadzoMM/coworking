import { Controller, Post, Body, Res, UnauthorizedException} from '@nestjs/common';
import type { Response } from 'express';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import {CreateUserDto} from '../users/create-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {}

@Post('register')
async register(@Body() dto: CreateUserDto) {
const user = await this.usersService.create(dto.email, dto.password);
const { password, ...result } = user;
return result;
}

@Post('login')
async login(@Body() dto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
const user = await this.authService.validateUser(dto.email, dto.password);
if (!user) throw new UnauthorizedException('Невірні дані');

const { access_token } = await this.authService.login(user);

res.cookie('jwt', access_token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 3600000,
});

return { message: 'Успішний вхід' };
}

@Post('logout')
logout(@Res({ passthrough: true }) res: Response) {
res.clearCookie('jwt');
return { message: 'Ви вийшли з системи' };
}
}
