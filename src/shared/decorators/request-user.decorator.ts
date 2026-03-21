import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import type { JwtPayload } from '../../authentication/models/jwt-payload.model';

export const RequestUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: JwtPayload }>();
    if (!request.user) {
      throw new Error('Cant retrieve user payload on this request');
    }
    return request.user;
  },
);
