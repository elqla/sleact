// AOP
// Aspect Oriented Programming

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

// middleware 실행 순서

// A -> B -> C -> D

// A -> C -> D

// Z -> A -> X -> D

// A ---> D 순으로 실행된다. (공통의 미들웨어를 가짐)
// 미들웨어가 가로로 실행되지만, 잘보면 세로로도 공통인게 있음. (AOP)
// 이를 중복제거할 순 없을까 ? --> 인터셉터
// ex) interceptor가 a, d를 하고 b,c 는 컨트롤러에.

// main controller 실행 전, 후 로 특정 동작을 넣어 줄 수 있음.

// 이전에 작성한 로거미들웨어와 같은걸로 시간측정 할 수 있다거나
// 강사님은 컨트롤러 다음에 어떤걸 할지를 생각.
// 보통 res.send 전의 동작을 많이 추가하지
// 그 이후에 res.send 보낸 후 그 응답을 조작해줬으면 좋겠다. 싶을때 애매한데
// 이때 그 데이터를 한번 더 조작하게 해줄때 인터셉터를 많이 사용함.

// route에서 return user 말고, {data: user, code: 'success'} 등으로 알아서 해줬으면 할때 사용한다던가
// 결국 res.json으로 한정하는게 아니라, 데이터를 가공할 기회를 줌
// 끝에 return 시의 데이터 중복 제거.
@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // 전 부분 (컨트롤러 가기 전) -- logging시 시간초 잴때 쓸 수 있지만, 잘 안쓰심
    // context.switchToWs() - 웹소켓
    return next.handle().pipe(
      map((data) => (data === undefined ? null : data)),
      // map((data) => ({
      //   data,
      //   code: 'SUCCESS',
      // })),
    ); // 컨트롤러 간 후  {data: user, code: success}
  }
}

// ERROR도 컨트롤 되지만, Exception Filter 사용함.
