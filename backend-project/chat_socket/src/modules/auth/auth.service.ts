import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import Hash from 'src/utils/hashing';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { md5 } from 'src/utils/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
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
  async logout(accessToken: string) {
    const hashAccessToken = md5(accessToken);
    await this.redis.set(
      `blacklist_${hashAccessToken}`,
      hashAccessToken,
      'EX',
      60 * 60,
    );
    return {
      success: true,
    };
  }
  getUserFromToken(token: string) {
    const decoded = this.decodedToken(token);
    if (!decoded) {
      return false;
    }
    return this.userService.findOne(decoded.id);
  }
  async refreshToken(refreshToken: string) {
    //Decode token
    const decoded = this.decodedToken(refreshToken);
    if (!decoded) {
      return false;
    }
    //Kiểm tra refresh token trên redis
    const hashRefreshToken = md5(refreshToken);
    const tokenRedis = await this.redis.get(`refresh_${hashRefreshToken}`);
    if (!tokenRedis) {
      return false;
    }
    //Tạo token
    return this.createToken(decoded);
  }
  private decodedToken(token: string) {
    return this.jwtService.decode(token);
  }
  private async createToken(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
    };
    const accessToken = this.jwtService.sign(payload);
    const accessTokenDecoded = this.jwtService.decode(accessToken);

    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRED,
    });
    const hashRefreshToken = md5(refreshToken);
    const refreshTokenDecoded = this.jwtService.decode(refreshToken);
    const accessTokenExpires = accessTokenDecoded.exp;
    const refreshTokenExpires = refreshTokenDecoded.exp;
    const expire = Math.floor(refreshTokenExpires - Date.now() / 1000);

    await this.redis.set(
      `refresh_${hashRefreshToken}`,
      hashRefreshToken,
      'EX',
      expire,
    );
    return {
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires,
    };
  }
}
