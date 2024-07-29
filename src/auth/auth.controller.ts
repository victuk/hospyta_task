import { Controller, Get, HttpCode, HttpException, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import {AuthService} from "./auth.service"
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDTO, RegisterDTO } from 'src/dtos/user.dto';



@Controller('auth')
@ApiTags("Auth")
export class AuthController {

    constructor(private authService: AuthService) {}

    @Post("register")
    @HttpCode(201)
    @ApiBody({type: RegisterDTO})
    async registerUser (@Req() request: Request) {
        try {

            return await this.authService.createUser(request.body);
            
        } catch (error) {
            return new HttpException("An error occurred", 500, error);
        }
    }

    @Post("login")
    @HttpCode(200)
    @ApiBody({type: LoginDTO})
    async loginTheUser (@Req() request: Request) {
        return await this.authService.loginUser(request.body);
    }

}
