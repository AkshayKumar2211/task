import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private readonly userModel:Model<User>
    ){}


    async getAllUser()
    {
        try {
            const users=await this.userModel.find();

            if(!users)
            {
                throw new BadRequestException("User table is empty");
            }

            return users;
        } catch (error) {
            throw new Error();
        }
    }


    async deleteUser(id:string)
    {
        try{
            if(!id)
            {
                throw new BadRequestException("User with this id does not exist");
            }
            const deleteUser=await this.userModel.findByIdAndDelete(id);

            if(!id)
            {
                throw new BadRequestException("Unable to delete the user");
            }

            return {
                message:"User deleted successfully"
            }
        }
        catch{
           throw new Error();
        }
    }


   async findUserById(id:string)
     {
        try{
            if(!id)
            {
                throw new BadRequestException("User with this id does not exist");
            }
            const user=await this.userModel.findById(id);

            if(!id)
            {
                throw new BadRequestException("Unable to delete the user");
            }

            return {
                message:"User deleted successfully"
            }
        }
        catch{
           throw new Error();
        }
    }

    async editProfile(id)
    {

    }


}
