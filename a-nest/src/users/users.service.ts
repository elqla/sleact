import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  // module -> controller -> service -> repository -> entity로 쿼리
  constructor(
    // Dependency injection시 실제 객체는 module에서 넣어줘야함.
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  // async에서 throw한 경우엔 서버를 멈추지 않고, 경고만 뜨고 만다.
  async join(email: string, nickname: string, password: string) {
    if (!nickname) {
      throw new HttpException('nickname이 없어요.', 400);
    }
    if (!email) {
      throw new HttpException('email이 없어요.', 400);
    }
    if (!password) {
      throw new HttpException('password가 없어요.', 400);
    }

    const user = await this.usersRepository.findOne({ where: { email } });

    if (user) {
      // 이미 존재
      throw new HttpException('이미 존재하는 사용자입니다.', 400);
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await this.usersRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });
  }
}
