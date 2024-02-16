import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Chennels')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
  @Get()
  getAllChennels() {}

  @Post()
  createChannel() {}

  @Get(':name')
  getSpecificChannel() {}

  @Get(':name/chats')
  getChat(@Query() query, @Param('id') id, @Param('url') url) {
    console.log(query.perPage, query.page);
  }

  @Post(':name/chats')
  postChat(@Body() body) {}

  @Get(':name/members')
  getAllMembers() {}

  @Post(':name/members')
  inviteMembers() {}
}
