import { IsEnum, IsString } from "class-validator";
import { Role } from "src/user/schema/user.schema";

export class loginDto{
       @IsString()
        email:string;
    
        @IsString()
        password:string;
}