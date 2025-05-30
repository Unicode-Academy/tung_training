import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }
  @Post('login')
  async login(@Body() { email, password }: any) {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    const user = await this.authService.login(email, password);
    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }
    return user;
  }
  @Post('refresh-token')
  async refreshToken(@Body() { refreshToken }: any) {
    if (!refreshToken) {
      throw new BadRequestException('Please provide fresh token');
    }
    const token = await this.authService.refreshToken(refreshToken);
    if (!token) {
      throw new UnauthorizedException('Unathorized');
    }
    return token;
  }
  @Delete('logout')
  @UseGuards(AuthGuard)
  logout(@Request() req: Request & { user: { [key: string]: string } }) {
    const user = req.user;
    return this.authService.logout(user.token);
  }
  @Get('profile')
  @UseGuards(AuthGuard)
  profile(@Request() req: Request & { user: { [key: string]: string } }) {
    return req.user;
  }
}
