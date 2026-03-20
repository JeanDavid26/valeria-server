import { AuthenticationController } from './authentication.controller';
import { createMock } from '@golevelup/ts-jest';
import { AuthenticationService } from '../services/authentication.service';
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

      authenticationService.signIn.mockResolvedValueOnce({
        accessToken: '',
        refreshToken: '',
      });

      await controller.signIn(signInDto);

      expect(authenticationService.signIn).toHaveBeenCalledWith(signInDto);
    });
  });

  describe('register', () => {
    it('should call the service with the right params', async () => {
      const registerDto: RegisterDto = {
        email: 'test@test.com',
        password: 'password',
        username: 'username',
      };

      authenticationService.register.mockResolvedValueOnce({
        accessToken: '',
        refreshToken: '',
      });

      await controller.register(registerDto);

      expect(authenticationService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('refreshToken', () => {
    it('should call the service with the right params', async () => {
      const token = 'token';

      authenticationService.refreshToken.mockResolvedValueOnce({
        accessToken: '',
        refreshToken: '',
      });
      await controller.refreshToken({ refreshToken: token });

      expect(authenticationService.refreshToken).toHaveBeenCalledWith(token);
    });
  });
});
