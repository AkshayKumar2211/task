import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { AuthGuard } from 'src/auth/guards/auth.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';


@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}


  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }


  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

 
  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ) {
    return this.blogService.update(id, updateBlogDto);
  }


  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}