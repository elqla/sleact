import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Token = createParamDecorator(
  // ! 실행 컨텍스트 : ExecutionContext
  // ExecutionContext: HTTP서버, ws, rpc,등을 돌릴때 하나의 실행 컨텍스트에서 관리를 하고.
  // 그 중 HTTP에 대한 정보를 가져오고 싶다. 그 안의 응답 객체를 가져온다.
  (data: unknown, ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse();
    return response.locals.jwt;
    //  이부분 return 부분만 수정해주면 되기 때문.!
  },
);

// @Token() token

// Controller에서 req.user, req.jwt 이런거 쓰는걸 막을 수 있음.
// 테스트하거나, fastify로 바꾼다고 할때 일일이 찾아서 수정하기 쉬움.
