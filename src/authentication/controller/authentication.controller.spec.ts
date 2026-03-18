import { Test, TestingModule } from '@nestjs/testing';
import { NotImplementedException } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';

describe('ControllerController', () => {
  let controller: AuthenticationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
    }).compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should throw NotImplementedException', () => {
      expect(() => controller.signIn()).toThrow(NotImplementedException);
    });
  });

  describe('signOut', () => {
    it('should throw NotImplementedException', () => {
      expect(() => controller.signOut()).toThrow(NotImplementedException);
    });
  });

  describe('register', () => {
    it('should throw NotImplementedException', () => {
      expect(() => controller.register()).toThrow(NotImplementedException);
    });
  });

  describe('refreshToken', () => {
    it('should throw NotImplementedException', () => {
      expect(() => controller.refreshToken()).toThrow(NotImplementedException);
    });
  });
});
