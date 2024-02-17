import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ParseArray = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const value = request.query[data as string];

    try {
      if (!value) return undefined;
      return JSON.parse(value);
    } catch (error) {
      throw new Error(`Invalid JSON array: ${value}`);
    }
  },
);
