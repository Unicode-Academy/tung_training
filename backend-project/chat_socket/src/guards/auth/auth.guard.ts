import { InjectRedis } from '@nestjs-modules/ioredis';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import Redis from 'ioredis';
import { Observable } from 'rxjs';
import { AuthService } from 'src/modules/auth/auth.service';
import { md5 } from 'src/utils/utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    @InjectRedis() private readonly redis: Redis,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];
    if (token) {
      //Kiểm tra blacklist
      const hashAccessToken = md5(token);
      const tokenRedis = await this.redis.get(`blacklist_${hashAccessToken}`);
      if (tokenRedis) {
        return false;
      }
      const user = await this.authService.getUserFromToken(token);
      if (user) {
        request.user = user;
        request.user.token = token;
        return true;
      }
    }

    return false;
  }
}
