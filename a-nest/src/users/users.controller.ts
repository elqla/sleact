import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from 'src/common/dto/user.dto';
import { User } from 'src/common/decorators/user.decorator';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';

@UseInterceptors(UndefinedToNullInterceptor)
//  이 컨트롤러 모두, 언디파인드면 다 널로. 혹은 개별 라우터별로도 사용 가능함.
@ApiTags('Users')
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiResponse({
    status: 500,
    description: '서버에러',
  })
  @ApiOperation({ summary: '내 정보 조회' }) // Swagger
  @Get()
  getUsers(@User() user) {
    return user;
  }

  @ApiOperation({ summary: '회원가입' })
  @Post()
  async join(@Body() body: JoinRequestDto) {
    // await 꼭 쓰기
    await this.usersService.join(body.email, body.nickname, body.password);
  }

  // @ApiOkResponse({
  //   // 200
  //   type: UserDto,
  //   description: '성공',
  // })
  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@User() user) {
    return user;
  }

  // Logout은 req, res를 쓰게됨.
  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logOut(@Req() req, @Res() res) {
    req.logOut();
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('ok');
  }
}
