import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { DataSource, Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { ChannelMembers } from 'src/entities/ChannelMembers';

@Injectable()
export class UsersService {
  // module -> controller -> service -> repository -> entity로 쿼리
  constructor(
    // Dependency injection시 실제 객체는 module에서 넣어줘야함.
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    // 요기 추가하면 module에 import 추가하는거 잊지말기
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    // transaction
    private dataSource: DataSource,
  ) {}

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
  }
  // async에서 throw한 경우엔 서버를 멈추지 않고, 경고만 뜨고 만다.
  async join(email: string, nickname: string, password: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    // app.module에 import한 typeormmodule.forroot를 통해 실행될지
    // 현재 connect를 통해 실행될까?
    // this를 통해 가져온 레포지토리는 transactionconnect이 아닌 처음 실행된 connection에 맺어지므로
    // (queryrunner를 통해 가져와야한다..)
    await queryRunner.connect();
    await queryRunner.startTransaction();
    if (!nickname) {
      throw new BadRequestException('nickname이 없어요.');
    }
    if (!email) {
      throw new BadRequestException('email이 없어요.');
    }
    if (!password) {
      throw new BadRequestException('password가 없어요.');
    }

    const user = await queryRunner.manager
      .getRepository(Users)
      .findOne({ where: { email } });

    // const user = await this.usersRepository.findOne({ where: { email } });

    if (user) {
      // 이미 존재
      // throw new HttpException('이미 존재하는 사용자입니다.', 401);
      throw new UnauthorizedException('이미 존재하는 사용자입니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    // save = insert into
    try {
      const returned = await queryRunner.manager.getRepository(Users).save({
        email,
        nickname,
        password: hashedPassword,
      });
      // 저장한 유저값 = returned
      await queryRunner.manager.getRepository(WorkspaceMembers).save({
        UserId: returned.id,
        WorkspaceId: 1,
      });
      // 이렇게도 쓸 수 있음.
      // const workspaceMember = new WorkspaceMembers(); // this.workspaceMembersRepository.create()도 가능
      // workspaceMember.UserId = returned.id;
      // workspaceMember.WorkspaceId = returned.id;
      // await this.workspaceMembersRepository.save(workspaceMember)
      await queryRunner.manager.getRepository(ChannelMembers).save({
        UserId: returned.id,
        ChannelId: 1,
      });
      return true;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // db에 최대 연결 개수가 있어서, 수동 커넥트, 릴리즈 필수
      await queryRunner.release();
    }
  }
}
