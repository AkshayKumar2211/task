import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './schema/blog.schema';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';


@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name)
    private blogModel: Model<Blog>,
  ) {}

  async create(createBlogDto: CreateBlogDto) {
    return await this.blogModel.create(createBlogDto);
  }

  async findAll() {
    return await this.blogModel.find();
  }

  async findOne(id: string) {
    const blog = await this.blogModel.findById(id);
    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  async update(id: string, updateBlogDto: UpdateBlogDto) {
    const blog = await this.blogModel.findByIdAndUpdate(
      id,
      updateBlogDto,
      { new: true },
    );

    if (!blog) throw new NotFoundException('Blog not found');
    return blog;
  }

  async remove(id: string) {
    const blog = await this.blogModel.findByIdAndDelete(id);
    if (!blog) throw new NotFoundException('Blog not found');
    return { message: 'Blog deleted successfully' };
  }
}