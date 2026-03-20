jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import { AuthenticationService } from './authentication.service';
import { createMock } from '@golevelup/ts-jest';
import { UserRepository } from '../repository/user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { User } from '../models/user.model';

const userRepository = createMock<UserRepository>();
const jwtService = createMock<JwtService>();
const configService = createMock<ConfigService>();

const mockUser: User = {
  id: 'user-id',
  email: 'test@test.com',
  username: 'testuser',
  password: 'hashed-password',
};

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new AuthenticationService(
      userRepository,
      jwtService,
      configService,
    );

    jwtService.sign.mockReturnValue('mock-token');
    configService.getOrThrow.mockReturnValue(900);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should hash password and upsert user', async () => {
      const param = {
        email: 'test@test.com',
        username: 'testuser',
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
        username: 'testuser',
        password: 'hashed-password',
      });
      expect(result).toEqual({
        accessToken: 'mock-token',
        refreshToken: 'mock-token',
      });
    });
  });

  describe('signIn', () => {
    it('should return tokens when credentials are valid', async () => {
      const param = { email: 'test@test.com', password: 'plain-password' };
      userRepository.findByEmail.mockResolvedValueOnce(mockUser);
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);

      const result = await service.signIn(param);

      expect(userRepository.findByEmail).toHaveBeenCalledWith('test@test.com');
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'plain-password',
        'hashed-password',
      );
      expect(result).toEqual({
        accessToken: 'mock-token',
        refreshToken: 'mock-token',
      });
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
      jwtService.verify.mockReturnValueOnce({
        sub: 'user-id',
        email: 'test@test.com',
      });
      userRepository.findById.mockResolvedValueOnce(mockUser);

      const result = await service.refreshToken('valid-token');

      expect(jwtService.verify).toHaveBeenCalledWith('valid-token');
      expect(userRepository.findById).toHaveBeenCalledWith('user-id');
      expect(result).toEqual({
        accessToken: 'mock-token',
        refreshToken: 'mock-token',
      });
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
