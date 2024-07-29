import { ApiProperty } from "@nestjs/swagger";
import {IsEmail, IsNotEmpty, IsString} from "class-validator"

export class LoginDTO {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    emailOrUsername: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password: string;

}

export class RegisterDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    fullName: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    username: string;
    
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password: string;
}
