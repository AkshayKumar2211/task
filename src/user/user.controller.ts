import { Controller, Get, Param, Delete, Patch, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { Types } from 'mongoose';
import { Role } from './schema/user.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

 
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userService.findUserById(id);
  }

 
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: { name?: string; email?: string; role?: Role; password?: string }
  ) {
    if(updateData)
    {
    return this.userService.editProfile(id, updateData);
    }
  }
}