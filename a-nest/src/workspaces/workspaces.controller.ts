import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { WorkspacesService } from './workspaces.service';
import { Users } from 'src/entities/Users';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
@ApiTags('Workspace')
@Controller('api/workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  @ApiOperation({ summary: '내 워크스페이스 가져오기' })
  @Get()
  async getMyWorkspaces(@User() user: Users) {
    return this.workspacesService.findMyWorkspaces(user.id);
  }
  // @Get('/:myId')
  // 문자열 -> 숫자 paraseint, valueof, + , parseintpipe
  // getMyWorkspaces(@Param("myId", ParseIntPipe) myId: number){
  //   return this.workspacesService.findMyWorkspaces(myId)
  // }
  // 만약 ParseArraypipe머 이러케 바꿔주는거면 new 써줘야함

  @ApiOperation({ summary: '워크스페이스 만들기' })
  @Post()
  // req user 필요시 body - dto로 만들어두기 - typecheck, swagger
  async createWorkspace(@User() user: Users, @Body() body: CreateWorkspaceDto) {
    return this.workspacesService.createWorkspace(
      body.workspace,
      body.url,
      user.id,
    );
  }

  @ApiOperation({ summary: '워크스페이스 멤버 가져오기' })
  @Get(':url/members')
  async getWorkspaceMembers(@Param('url') url: string) {
    return this.workspacesService.getWorkspaceMembers(url);
  }

  @ApiOperation({ summary: '워크스페이스 멤버 초대하기' })
  @Post(':url/members')
  async createWorkspaceMembers(
    @Param('url') url: string,
    @Body('email') email,
  ) {
    return this.workspacesService.createWorkspaceMembers(url, email);
  }

  @ApiOperation({ summary: '워크스페이스 특정멤버 가져오기' })
  @Get(':url/members/:id')
  async getWorkspaceMember(
    @Param('url') url: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.workspacesService.getWorkspaceMember(url, id);
  }

  @ApiOperation({ summary: '워크스페이스 특정멤버 가져오기' })
  @Get(':url/users/:id')
  async DEPRECATED_getWorkspaceUser(
    @Param('url') url: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.workspacesService.getWorkspaceMember(url, id);
  }
}
