import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import Hash from 'src/utils/hashing';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  register(body: any) {
    return this.userService.create(body);
  }
  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (user) {
      const passwordHash = user.password;
      if (Hash.compare(password, passwordHash)) {
        //Tạo jwt
        return this.createToken(user);
      }
    }
    return false;
  }
  getUserFromToken(token: string) {
    const decoded = this.decodedToken(token);
    if (!decoded) {
      return false;
    }
    return this.userService.findOne(decoded.id);
  }
  private decodedToken(token: string) {
    return this.jwtService.decode(token);
  }
  private createToken(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
    };
    const accessToken = this.jwtService.sign(payload);
    const accessTokenDecoded = this.jwtService.decode(accessToken);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRED,
    });
    const refreshTokenDecoded = this.jwtService.decode(refreshToken);
    const accessTokenExpires = accessTokenDecoded.exp;
    const refreshTokenExpires = refreshTokenDecoded.exp;
    return {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
    };
  }
}
