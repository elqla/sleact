import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

// ! 실무에선 nest-morgan 적용하길
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  // new Logger('context')인데 context가 필요 없는 경우, 그냥 Logger.log() 해주면 됨.
  // console.log 보다 logger.log더 많이 씀.
  // 이 콘솔 로그가 어떤거랑 관련 되어있는지. 보통 debug라는 라이브러리를 쓴다. (in express)

  use(req: any, res: any, next: (error?: any) => void) {
    // 1st
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    // 3rd
    // res.on은 router보다 먼저 실행됨
    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });
    // 2st
    next();
  }
}
