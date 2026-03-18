import { Controller, NotImplementedException, Post } from '@nestjs/common';

@Controller('authentication')
export class AuthenticationController {
  @Post()
  register(): void {
    throw new NotImplementedException();
  }

  @Post()
  signIn(): void {
    throw new NotImplementedException();
  }

  @Post()
  signOut(): void {
    throw new NotImplementedException();
  }

  @Post()
  refreshToken(): void {
    throw new NotImplementedException();
  }
}
