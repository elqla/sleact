import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChannelMembers } from 'src/entities/ChannelMembers';
import { Channels } from 'src/entities/Channels';
import { Users } from 'src/entities/Users';
import { WorkspaceMembers } from 'src/entities/WorkspaceMembers';
import { Workspaces } from 'src/entities/Workspaces';
import { Repository } from 'typeorm';

@Injectable()
export class WorkspacesService {
  @InjectRepository(Workspaces)
  private workspacesRepository: Repository<Workspaces>;
  @InjectRepository(Channels)
  private channelsRepository: Repository<Channels>;
  @InjectRepository(WorkspaceMembers)
  private workspaceMembersRepository: Repository<WorkspaceMembers>;
  @InjectRepository(ChannelMembers)
  private channelMembersRepository: Repository<ChannelMembers>;
  @InjectRepository(Users)
  private usersRepository: Repository<Users>;

  async findById(id: number) {
    return this.workspacesRepository.findOne({ where: { id } });
  }
  // return this.workspacesRepository.find({where:{id},skip, take:1}) // skip: offset, take: limit
  // findone, findbyids

  async findMyWorkspaces(myId: number) {
    return this.workspacesRepository.find({
      where: {
        WorkspaceMembers: [{ UserId: myId }],
      },
    });
  }

  async createWorkspace(name: string, url: string, myId: number) {
    // 워크스페이스 만들기
    // entity 객체 만들고 save create 헷갈려서 잘 안씀.
    // const workspace = this.workspacesRepository.create({
    //   name,
    //   url,
    //   OwnerId: myId,
    // });
    // const returned = this.workspacesRepository.save(workspace);

    // Promiseall 로 시간 단축
    const workspace = new Workspaces();
    workspace.name = name;
    workspace.url = url;
    workspace.OwnerId = myId;
    const returned = await this.workspacesRepository.save(workspace);
    const workspaceMember = new WorkspaceMembers();
    workspaceMember.UserId = myId;
    workspaceMember.WorkspaceId = returned.id;
    await this.workspaceMembersRepository.save(workspaceMember);
    const channel = new Channels();
    channel.name = '일반';
    channel.WorkspaceId = returned.id;
    const channelReturned = await this.channelsRepository.save(channel);
    const channelMember = new ChannelMembers();
    channelMember.UserId = myId;
    channelMember.ChannelId = channelReturned.id;
    await this.channelMembersRepository.save(channelMember);
  }

  // querybuilder - sql느낌ㅡ(많이쓰심)
  async getWorkspaceMembers(url: string) {
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.WorkspaceMembers', 'members') // entity에 대한 별명 'members'
      .innerJoin('members.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      }) // innerjoin으로 필터링은 되지만 가져오진 않음
      .getMany();

    // .innerJoin('u.Workspaces', 'm') // manytomany 버그때문에 위처럼 씀.

    // getMany:  members. .앞을 객체로 인식해서 문자열로 만드는걸 피할 수 있음.
    // getRawMany: Id, Pw, W.name, w.url
    // {id: '', email:'', 'workspace.name':''}

    // 성능 중요하면 rawquery쓰면 됨.
  }

  async createWorkspaceMembers(url, email) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
      // relations: ['Channels']
      join: {
        alias: 'workspace',
        innerJoinAndSelect: {
          channels: 'workspace.Channels',
        },
      },
    });

    // this.workspacesRepository.createQueryBuilder("workspace").innerJoinAndSelect("workspace.Channels", "channels").getOne()
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    // 워크스페이스에 사용자 추가해서 저장
    const workspaceMember = new WorkspaceMembers();
    workspaceMember.WorkspaceId = workspace.id;
    workspaceMember.UserId = user.id;
    await this.workspaceMembersRepository.save(workspaceMember);
    const channelMember = new ChannelMembers();
    // 일반 채널에만 초대하기
    channelMember.ChannelId = workspace.Channels.find(
      (v) => v.name === '일반',
    ).id;
    channelMember.UserId = user.id;
    await this.channelMembersRepository.save(channelMember);
  }

  // 워크스페이스 멤버 가져오기
  async getWorkspaceMember(url: string, id: number) {
    // insert into values
    // this.usersRepository
    //   .createQueryBuilder('u')
    //   .insert()
    //   .into(Users)
    //   .values(new Users()).execute;

    return (
      this.usersRepository
        .createQueryBuilder('user')
        // .where({id})
        // .andWhere도 있음.
        // sequalizer  <  typeorm 의 쿼리빌더가 더 좋을때가 있음 + rowquery
        .where('user.id = :id', { id })
        .innerJoin('user.Workspaces', 'workspaces', 'workspaces.url = :url', {
          url,
        })
        .getOne()
    );
  }
}
