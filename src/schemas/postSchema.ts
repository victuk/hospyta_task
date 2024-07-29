import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, { HydratedDocument, PaginateModel} from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { User } from "./userSchema";

export const postCategory = ["Kidney", "Headache", "Stomachache", "Leg pain", "Malaria"];


@Schema({timestamps: true})
export class Post {

    @Prop({
        required: true
    })
    title: string;

    @Prop({
        required: true
    })
    body: string;

    @Prop({
        type: String,
        default: null
    })
    image?: string;

    @Prop({
        enum: postCategory,
        required: true
    })
    category: string;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    })
    createdBy: User;

    @Prop({
        type: Number,
        default: 0
    })
    upVoteCount?: number;

    @Prop({
        type: Number,
        default: 0
    })
    downVoteCount: number;
}


export type PostSchemaType = HydratedDocument<Post> & PaginateModel<Post>;

export const PostSchema = SchemaFactory.createForClass(Post);
