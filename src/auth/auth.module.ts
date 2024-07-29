import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/userSchema';
import mongoosePaginate from "mongoose-paginate-v2";


@Module({
    imports: [MongooseModule.forFeatureAsync([{name: User.name, useFactory() {
        const schema = UserSchema;

        schema.plugin(require("mongoose-paginate-v2"));

        return schema;
    }}])],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
