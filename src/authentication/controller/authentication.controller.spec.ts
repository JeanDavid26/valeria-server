import { createMock } from '@golevelup/ts-jest';

import { mockAuthTokens } from '../__mocks/auth-tokens.mock';
import { AuthenticationService } from '../services/authentication.service';
import { AuthenticationController } from './authentication.controller';
import { RegisterDto } from './dtos/register.dto';

const authenticationService = createMock<AuthenticationService>();
describe('ControllerController', () => {
  let controller: AuthenticationController;

  beforeEach(() => {
    controller = new AuthenticationController(authenticationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should call the service with the right params', async () => {
      const signInDto = {
        email: 'test@test.com',
        password: 'password',
      };

      authenticationService.signIn.mockResolvedValueOnce(mockAuthTokens);

      await controller.signIn(signInDto);

      expect(authenticationService.signIn).toHaveBeenCalledWith(signInDto);
    });
  });

  describe('register', () => {
    it('should call the service with the right params', async () => {
      const registerDto: RegisterDto = {
        email: 'test@test.com',
        password: 'password',
      };

      authenticationService.register.mockResolvedValueOnce(mockAuthTokens);

      await controller.register(registerDto);

      expect(authenticationService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('refreshToken', () => {
    it('should call the service with the right params', async () => {
      const token = 'token';

      authenticationService.refreshToken.mockResolvedValueOnce(mockAuthTokens);
      await controller.refreshToken({ refreshToken: token });

      expect(authenticationService.refreshToken).toHaveBeenCalledWith(token);
    });
  });
});
