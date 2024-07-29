import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "./userSchema";
import { Post } from "./postSchema";

export const voteTypeList = ["upvote", "downvote"];

@Schema({timestamps: true})
export class Like {

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    })
    createdBy: User;

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
    Post: Post;

    @Prop({
        type: String,
        enum: voteTypeList,
        required: true
    })
    voteType: Post;

}


export type VoteSchemaType = HydratedDocument<Like>;

export const VoteSchema = SchemaFactory.createForClass(Like);