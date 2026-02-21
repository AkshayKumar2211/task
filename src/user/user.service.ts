import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  // Get all users
  async getAllUsers() {
    try {
      const users = await this.userModel.find();
      if (!users || users.length === 0) {
        throw new NotFoundException("No users found");
      }
      return users;
    } catch (error) {
      throw new BadRequestException(error.message || "Failed to fetch users");
    }
  }

  // Delete user by ID
  async deleteUser(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid user ID");
    }

    const deletedUser = await this.userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new NotFoundException("User not found or already deleted");
    }

    return {
      message: "User deleted successfully",
      user: deletedUser,
    };
  }

  // Find user by ID
  async findUserById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid user ID");
    }

    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }

  // Edit/update user profile
  async editProfile(id: string, updateData: Partial<User>) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid user ID");
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new NotFoundException("User not found");
    }

    return updatedUser;
  }
}