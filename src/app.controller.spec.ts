import { createMock } from '@golevelup/ts-jest';

import { AppController } from './app.controller';
import { AppService } from './app.service';

const appService = createMock<AppService>();
describe('AppController', () => {
  let appController: AppController;

  beforeEach(() => {
    appController = new AppController(appService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      appService.getHello.mockReturnValue('Hello World!');
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
