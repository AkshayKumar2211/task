import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/user/schema/user.schema';
import { userDto } from './dto/create.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>,
private readonly jwtService:JwtService){}

          async register(dto: userDto) {
                const { email, password, role ,name } = dto;


                if (!email || !password || !role) {
                    throw new BadRequestException("Email, password and role are required");
                }


                const existingUser = await this.userModel.findOne({ email });
                if (existingUser) {
                    throw new BadRequestException("User already exists with this email");
                }

                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(password, saltRounds);


                const newUser = await this.userModel.create({
                    name,
                    email,
                    password: hashedPassword,
                    role,
                });

                

                return {
                    message: "User created successfully",
                    user: {
                    id: newUser._id,
                    email: newUser.email,
                    role: newUser.role,
                    },
                };
                }


      

        async login(dto: loginDto) {
                const { email, password } = dto;

                if (!email || !password) {
                    throw new BadRequestException("Email and password are required");
                }

                const existingUser = await this.userModel.findOne({ email });

                if (!existingUser) {
                    throw new UnauthorizedException("Invalid credentials");
                }

                const isMatch = await bcrypt.compare(password, existingUser.password);

                if (!isMatch) {
                    throw new UnauthorizedException("Invalid credentials");
                }

                const payload = {
                    id: existingUser._id,
                    email: existingUser.email,
                    role: existingUser.role,
                };

                const token = await this.jwtService.signAsync(payload);

                return {
                    message: "Login successful",
                    token,
                    user: {
                    id: existingUser._id,
                    email: existingUser.email,
                    role: existingUser.role,
                    }
                };
                }

}
