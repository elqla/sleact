import { ApiProperty } from '@nestjs/swagger';
// extends picktype(Workspaces, ['workspace','url'])
export class CreateWorkspaceDto {
  @ApiProperty({
    example: '슬리액트',
    description: '워크스페이스명',
  })
  public workspace: string;

  @ApiProperty({
    example: 'sleact',
    description: 'url 주소',
  })
  public url: string;
}
