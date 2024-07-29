import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, { HydratedDocument} from "mongoose";
import { User } from "./userSchema";
import { Post } from "./postSchema";
import mongoosePaginate from "mongoose-paginate-v2";

@Schema({timestamps: true})
export class Comment {

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    })
    createdBy?: User;


    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        null: true,
        default: null
    })
    inResponseTo?: User;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    })
    post: Post;

    @Prop({
        required: true
    })
    comment: string;

    @Prop({
        required: true,
        default: 0
    })
    commentLikeCount: Number;

}


export type CommentSchemaType = HydratedDocument<Comment>;

export const CommentSchema = SchemaFactory.createForClass(Comment);