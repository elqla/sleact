import { ApiProperty } from '@nestjs/swagger';
import { JoinRequestDto } from 'src/users/dto/join.request.dto';

// validation도 할 수 있음
export class UserDto extends JoinRequestDto {
  // @ApiProperty({
  //   required: true,
  //   example: 1,
  //   description: '아이디',
  // })
  // id: number;
}
