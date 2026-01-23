import { 
  Controller, Post, Get, Body, Res, Req, UseGuards, 
  UnauthorizedException, InternalServerErrorException 
} from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService, 
    private usersService: UsersService
  ) {}

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

    const { accessToken, refreshToken } = await this.authService.generateTokens(user);
    this.setTokensToCookies(res, accessToken, refreshToken);

    return { message: 'Success', user: { id: user.id, email: user.email } };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: any) {
    return req.user; 
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    try {
      await this.authService.logout(req.user.id);
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken', { path: '/auth/refresh' });
      return { message: 'Logged out' };
    } catch (e) {
      throw new InternalServerErrorException('Logout error');
    }
  }

  private setTokensToCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
