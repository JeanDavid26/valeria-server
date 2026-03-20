import { Body, Controller, Post } from '@nestjs/common';
import { AuthenticationService } from '../services/authentication.service';
import { RegisterDto } from './dtos/register.dto';
import { AuthTokens } from '../models/auth-tokens.model';
import { SignInDto } from './dtos/sign-in.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}
  @Post('register')
  register(@Body() registerDto: RegisterDto): Promise<AuthTokens> {
    return this.authenticationService.register(registerDto);
  }

  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto): Promise<AuthTokens> {
    return this.authenticationService.signIn(signInDto);
  }

  @Post('refresh-token')
  refreshToken(@Body() refresTokenDto: RefreshTokenDto): Promise<AuthTokens> {
    return this.authenticationService.refreshToken(refresTokenDto.refreshToken);
  }
}
