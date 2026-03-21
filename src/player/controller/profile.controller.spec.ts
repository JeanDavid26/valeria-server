import { createMock } from '@golevelup/ts-jest';
import { mockJwtPayload } from 'src/authentication/__mocks/jwt-payload.mock';

import { mockProfile } from '../__mocks/profile.mock';
import { ProfileService } from '../services/profile.service';
import { ProfileController } from './profile.controller';

describe('ProfileController', () => {
  let controller: ProfileController;

  const profileService = createMock<ProfileService>();

  beforeEach(() => {
    controller = new ProfileController(profileService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should call the service with correct params', async () => {
      profileService.getProfile.mockResolvedValueOnce(mockProfile);
      await controller.getProfile({ username: 'username', tag: '4444' });
      expect(profileService.getProfile).toHaveBeenCalledWith(
        'username',
        '4444',
      );
    });
  });

  describe('createProfile', () => {
    it('should call the service with correct params', async () => {
      profileService.createProfile.mockResolvedValueOnce(mockProfile);
      await controller.createProfile(mockJwtPayload, { username: 'username' });
      expect(profileService.createProfile).toHaveBeenCalledWith(
        mockJwtPayload.sub,
        'username',
      );
    });
  });
});
