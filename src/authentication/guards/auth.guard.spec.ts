import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { createMock } from '@golevelup/ts-jest';

import { JwtPayload } from '../models/jwt-payload.model';
import { AuthGuard } from './auth.guard';

const mockRequest = {
  headers: {
    authorization: 'Bearer mock-token',
  },
};

const mockContext = createMock<ExecutionContext>();
const jwtService = createMock<JwtService>();

describe('AuthGuard', () => {
  let guard: AuthGuard;
  beforeEach(() => {
    guard = new AuthGuard(jwtService);
  });

  describe('canActivate', () => {
    it('should throw unauthorized exception if no token was found', async () => {
      mockContext.switchToHttp().getRequest.mockReturnValue({ headers: {} });
      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(jwtService.verifyAsync).toHaveBeenCalledTimes(0);
    });

    it('should throw unauthorized exception if jwttoken is not valid', async () => {
      mockContext.switchToHttp().getRequest.mockReturnValue(mockRequest);
      jwtService.verifyAsync.mockRejectedValueOnce(false);

      await expect(guard.canActivate(mockContext)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('mock-token');
    });

    it('should return true and put user payload to request context when the jwt token is valid', async () => {
      const mockJwtPayload: JwtPayload = {
        email: 'test@test.com',
        sub: 'user-id',
      };
      mockContext.switchToHttp().getRequest.mockReturnValue(mockRequest);
      jwtService.verifyAsync.mockResolvedValueOnce(mockJwtPayload);

      const result = await guard.canActivate(mockContext);

      expect(result).toBeTruthy();
      expect(jwtService.verifyAsync).toHaveBeenCalledWith('mock-token');
      expect(mockRequest['user']).toStrictEqual(mockJwtPayload);
    });
  });
});
