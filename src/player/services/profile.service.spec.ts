import { ConflictException } from '@nestjs/common';

import { createMock } from '@golevelup/ts-jest';

import { UserService } from '../../authentication/services/user.service';
import { mockProfile } from '../__mocks/profile.mock';
import { ProfileRepository } from '../repositories/profile.repository';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;
  const userService = createMock<UserService>();
  const profileRepository = createMock<ProfileRepository>();

  beforeEach(() => {
    jest.resetAllMocks();
    service = new ProfileService(userService, profileRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return profile when found', async () => {
      profileRepository.findByUsernameAndTag.mockResolvedValueOnce(mockProfile);

      const result = await service.getProfile('testuser', '1234');

      expect(result).toEqual(mockProfile);
      expect(profileRepository.findByUsernameAndTag).toHaveBeenCalledWith(
        'testuser',
        '1234',
      );
    });

    it('should return null when profile not found', async () => {
      profileRepository.findByUsernameAndTag.mockResolvedValueOnce(null);

      const result = await service.getProfile('unknown', '0000');

      expect(result).toBeNull();
    });
  });

  describe('createProfile', () => {
    it('should create profile with generated tag', async () => {
      profileRepository.findByUsernameAndTag.mockResolvedValueOnce(null);
      profileRepository.create.mockResolvedValueOnce(mockProfile);

      const result = await service.createProfile('user-id', 'testuser');

      expect(result).toEqual(mockProfile);
      expect(profileRepository.create).toHaveBeenCalledWith({
        userId: 'user-id',
        username: 'testuser',
        tag: expect.stringMatching(/^\d{4}$/),
      });
    });

    it('should retry when tag already exists', async () => {
      profileRepository.findByUsernameAndTag
        .mockResolvedValueOnce(mockProfile)
        .mockResolvedValueOnce(mockProfile)
        .mockResolvedValueOnce(null);
      profileRepository.create.mockResolvedValueOnce(mockProfile);

      const result = await service.createProfile('user-id', 'testuser');

      expect(result).toEqual(mockProfile);
      expect(profileRepository.findByUsernameAndTag).toHaveBeenCalledTimes(3);
    });

    it('should throw ConflictException after max attempts', async () => {
      profileRepository.findByUsernameAndTag.mockResolvedValue(mockProfile);

      await expect(
        service.createProfile('user-id', 'testuser'),
      ).rejects.toThrow(ConflictException);
      expect(profileRepository.findByUsernameAndTag).toHaveBeenCalledTimes(10);
    });
  });
});
