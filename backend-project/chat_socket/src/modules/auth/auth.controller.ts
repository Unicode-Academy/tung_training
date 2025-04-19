import {
  BadRequestException,
  Body,
  Controller,
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
  @Get('profile')
  @UseGuards(AuthGuard)
  profile(@Request() req: Request & { user: { [key: string]: string } }) {
    return req.user;
  }
}
