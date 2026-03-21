import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { createMock } from '@golevelup/ts-jest';
import * as bcrypt from 'bcrypt';

import { mockAuthTokens } from '../__mocks/auth-tokens.mock';
import { mockJwtPayload } from '../__mocks/jwt-payload.mock';
import { mockUser } from '../__mocks/user.mock';
import { UserRepository } from '../repositories/user.repository';
import { AuthenticationService } from './authentication.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  const userRepository = createMock<UserRepository>();
  const jwtService = createMock<JwtService>();
  const configService = createMock<ConfigService>();

  beforeEach(() => {
    jest.resetAllMocks();
    service = new AuthenticationService(
      userRepository,
      jwtService,
      configService,
    );

    jwtService.sign.mockReturnValue(mockAuthTokens.accessToken);
    configService.getOrThrow.mockReturnValue(900);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should hash password and upsert user', async () => {
      const param = {
        email: 'test@test.com',
        password: 'plain-password',
      };

      (jest.spyOn(bcrypt, 'hash') as jest.Mock).mockResolvedValue(
        'hashed-password',
      );

      userRepository.upsert.mockResolvedValueOnce(mockUser);

      const result = await service.register(param);

      expect(bcrypt.hash).toHaveBeenCalledWith('plain-password', 10);
      expect(userRepository.upsert).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'hashed-password',
      });
      expect(result).toStrictEqual(mockAuthTokens);
    });
  });

  describe('signIn', () => {
    it('should return tokens when credentials are valid', async () => {
      const param = { email: mockUser.email, password: 'plain-password' };
      userRepository.findByEmail.mockResolvedValueOnce(mockUser);
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);

      const result = await service.signIn(param);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'plain-password',
        'hashed-password',
      );
      expect(result).toStrictEqual(mockAuthTokens);
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const param = { email: 'test@test.com', password: 'wrong-password' };
      userRepository.findByEmail.mockResolvedValueOnce(mockUser);
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(false);

      await expect(service.signIn(param)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refreshToken', () => {
    it('should return new tokens when refresh token is valid', async () => {
      jwtService.verify.mockReturnValueOnce(mockJwtPayload);
      userRepository.findById.mockResolvedValueOnce(mockUser);

      const result = await service.refreshToken(mockAuthTokens.refreshToken);

      expect(jwtService.verify).toHaveBeenCalledWith(
        mockAuthTokens.refreshToken,
      );
      expect(userRepository.findById).toHaveBeenCalledWith(mockJwtPayload.sub);
      expect(result).toStrictEqual(mockAuthTokens);
    });

    it('should throw UnauthorizedException when refresh token is invalid', async () => {
      jwtService.verify.mockImplementation(() => {
        throw new Error();
      });

      await expect(service.refreshToken('invalid-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
