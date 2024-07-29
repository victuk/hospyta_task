import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/schemas/postSchema';
import { Vote, VoteSchema } from 'src/schemas/voteSchema';
import { Comment, CommentSchema } from 'src/schemas/commentSchema';

@Module({
    imports: [
        MongooseModule.forFeatureAsync([{
            name: Post.name, useFactory() {
                const schema = PostSchema;

                schema.plugin(require("mongoose-paginate-v2"));

                return schema;

            }
        }]),
        MongooseModule.forFeatureAsync([{
            name: Vote.name, useFactory() {
                const schema = VoteSchema;
                schema.plugin(require("mongoose-paginate-v2"));

                return schema;
            }
        }]),
        MongooseModule.forFeatureAsync([{
            name: Comment.name, useFactory() {
                const schema = CommentSchema;

                schema.plugin(require("mongoose-paginate-v2"));

                return schema;
            }
        }]),
    ],
    controllers: [PostController],
    providers: [PostService]
})
export class PostModule { }
