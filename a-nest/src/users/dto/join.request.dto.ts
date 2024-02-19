// interface < class
// typescript 에만 존재하지않고, 실제 js로 남아있게끔
// export default < export class

import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Users } from 'src/entities/Users';

export class JoinRequestDto extends PickType(Users, [
  'email',
  'nickname',
  'password',
]) {}
