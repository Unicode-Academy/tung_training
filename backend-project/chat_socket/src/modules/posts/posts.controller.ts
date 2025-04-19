import { Body, Controller, Post } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller({
  path: 'posts',
  version: '1',
})
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() body: any) {
    return this.postsService.create(body);
  }
}
