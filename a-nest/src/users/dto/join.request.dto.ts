import { ApiProperty } from '@nestjs/swagger';

export class JoinRequestDto {
  // interface < class
  // typescript 에만 존재하지않고, 실제 js로 남아있게끔
  // export default < export class
  @ApiProperty({
    example: 'zerocho0@gmail.com',
    description: '이메일',
    required: true,
  })
  public email: string;
  @ApiProperty({
    example: 'zerocho',
    description: '닉네임',
    required: true,
  })
  public nickname: string;
  @ApiProperty({
    example: 'pw123',
    description: '비밀번호',
    required: true,
  })
  public password: string;
}
