import { createMock } from '@golevelup/ts-jest';

import { UserRepository } from '../repositories/user.repository';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  const userRepository = createMock<UserRepository>();

  beforeEach(() => {
    service = new UserService(userRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    it('should call repository with good params and omit password', async () => {
      userRepository.findById.mockResolvedValueOnce({
        id: 'user-id',
        email: 'test@test.com',
        password: 'password',
      });

      const result = await service.getUser('user-id');

      expect(userRepository.findById).toHaveBeenCalledWith('user-id');
      expect(result).toStrictEqual({
        id: 'user-id',
        email: 'test@test.com',
      });
    });
  });
});
