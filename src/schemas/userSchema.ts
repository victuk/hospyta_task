import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

@Schema({timestamps: true})
export class User {

    @Prop({
        required: true
    })
    fullName: string;

    @Prop({
        required: true,
        unique: true
    })
    username: string;

    @Prop({
        required: true,
        unique: true
    })
    email: string;

    @Prop({
        required: true
    })
    password: string;

}


export type UserSchemaType = HydratedDocument<User>;

export const UserSchema = SchemaFactory.createForClass(User);
