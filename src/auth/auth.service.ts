import { HttpCode, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDTO, RegisterDTO } from 'src/dtos/user.dto';
import { User } from 'src/schemas/userSchema';
import * as bcrypt from "bcrypt";
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor (@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService) {}
    
    async createUser(userDetails: RegisterDTO) {

        const salt = bcrypt.genSaltSync(10);

        userDetails.password = bcrypt.hashSync(userDetails.password, salt);

        await this.userModel.create(userDetails);

        return {
            message: "User created"
        };

    }

    async loginUser(userDetails: LoginDTO) {

        const user = await this.userModel.findOne({$or: [{email: userDetails.emailOrUsername}, {username: userDetails.emailOrUsername}]});

        if(!user) {
            throw new Error("No user found");
        }

        const passwordsMatch = bcrypt.compareSync(userDetails.password, user.password);

        if(!passwordsMatch){
            throw new Error("Invalid credentials");
        }

        const token = this.jwtService.sign({email: user.email, userId: user._id});

        return {
            userDetails: {
                fullName: user.fullName,
                email: user.email
            },
            token
        }
    }

}
