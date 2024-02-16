import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('api/workspacae/:url/dms')
export class DmsController {
  @Get(':id/chats')
  getChat(@Query() query, @Param('id') id, @Param('url') url) {
    console.log(query.perPage, query.page);
  }

  @Post(':id/chats')
  postChat(@Body() body) {}
}
