import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { AuthTokens } from '../models/auth-tokens.model';
import { JwtPayload } from '../models/jwt-payload.model';
import type { RegisterParam } from '../models/register.param';
import { SignInParam } from '../models/sign-in.param';
import { User } from '../models/user.model';
import { USER_REPOSITORY } from '../repository/user.repository';
import type { UserRepository } from '../repository/user.repository';

@Injectable()
export class AuthenticationService {
  constructor(
    @Inject(USER_REPOSITORY) private userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register({
    email,
    username,
    password,
  }: RegisterParam): Promise<AuthTokens> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user: Partial<User> = {
      email,
      username,
      password: hashedPassword,
    };
    const userInserted = await this.userRepository.upsert(user);
    return this.generateTokens(userInserted);
  }

  async signIn({ email, password }: SignInParam): Promise<AuthTokens> {
    const user = await this.userRepository.findByEmail(email);
    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      throw new UnauthorizedException();
    }

    return this.generateTokens(user);
  }

  async refreshToken(token: string): Promise<AuthTokens> {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);
      const user = await this.userRepository.findById(payload.sub);
      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException();
    }
  }

  private generateTokens(user: User): AuthTokens {
    const payload = { sub: user.id, email: user.email };
    const accessExpiration = Number(
      this.configService.getOrThrow('JWT_ACCESS_EXPIRATION'),
    );
    const refreshExpiration = Number(
      this.configService.getOrThrow('JWT_REFRESH_EXPIRATION'),
    );
    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: accessExpiration,
      }),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: refreshExpiration,
      }),
    };
  }
}
