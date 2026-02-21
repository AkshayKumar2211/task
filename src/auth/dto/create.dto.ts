import { IsEnum, IsString } from "class-validator";
import { Role } from "src/user/schema/user.schema";

export class userDto{ 
  
    @IsString()
    email:string;

    @IsString()
    password:string;

    @IsEnum(Role)
    role

}







