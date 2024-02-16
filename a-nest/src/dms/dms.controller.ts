import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('DM')
@Controller('api/workspacae/:url/dms')
export class DmsController {
  @ApiParam({
    name: 'url',
    required: true,
    description: '워크스페이스 url',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '사용자 id',
  })
  @ApiParam({
    name: 'url',
    required: true,
    description: '워크스페이스 url',
  })
  @ApiQuery({
    name: 'perPage',
    required: true,
    description: '한번에 가져오는 개수',
  })
  @Get(':id/chats')
  getChat(@Query() query, @Param('id') id, @Param('url') url) {
    console.log(query.perPage, query.page);
  }

  @ApiQuery({
    name: 'perPage',
    required: true,
    description: '불러올 페이지',
  })
  @Post(':id/chats')
  postChat(@Body() body) {}
}
