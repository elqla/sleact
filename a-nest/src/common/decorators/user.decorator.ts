import { ExecutionContext, createParamDecorator } from '@nestjs/common';
// 컨텍스트라는 것은 현재 동작의 배경
// 데코레이터가 어떤 환경에서 실행되고있는지에 대한 정보가 컨텍스트 안에 들어 있는 겁니다.
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const requeset = ctx.switchToHttp().getRequest();
    return requeset.user;
  },
);
