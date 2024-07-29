import { Controller, Delete, Get, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { Request } from 'express';
import { AuthGuard } from 'src/guard/auth.guard';
import { PostCommentDTO, PostDTO, PostVoteDTO } from 'src/dtos/post.dto';

@Controller('posts')
@ApiTags("Post")
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class PostController {

    constructor(private postService: PostService) { }

    @Post("/post")
    @ApiBody({type: PostDTO})
    async addSinglePost(@Req() request: Request) {
        return await this.postService.addAPost(request.body, request["userDetails"].userId);
    }

    @Get("bycategory/:category")
    @ApiParam({
        name: "category",
        description: "This is concerned with the category of the posts to be fetched",
        schema: { type: "string" }
    })
    @ApiQuery({
        name: "page",
        required: false,
        schema: {type: "integer"}
    })
    @ApiQuery({
        name: "limit",
        required: false,
        schema: {type: "integer"}
    })
    async getPostByCategory(@Req() request: Request) {
        const category = request.params.category;

        const page: number = parseInt(request.query.page as string);
        const limit: number = parseInt(request.query.limit as string);

        return await this.postService.getPostsByType(category, page, limit, request["userDetails"].userId);

    }

    @Post("comment")
    @ApiBody({type: PostCommentDTO})
    async addSingleComment(@Req() request: Request) {
        return await this.postService.addAComment(request.body, request["userDetails"].userId);
    }

    @Post("vote")
    @ApiBody({type: PostVoteDTO})
    async voteSinglePost(@Req() request: Request) {
        return await this.postService.voteAPost(request.body, request["userDetails"].userId);
    }
    
    @Get("posts/:postId")
    @ApiParam({
        name: "postId",
        description: "The post id of the post",
        schema: {
            type: "string"
        }
    })
    async getSinglePost(@Req() request: Request) {
        const postId = request.params.postId;

        console.log("PostId", request.params);

        return await this.postService.getAPost(postId);
    }

    @Put("post/:postId")
    @ApiParam({
        name: "postId",
        description: "The post id of the post",
        schema: {
            type: "string"
        }
    })
    @ApiBody({type: PostDTO})
    async editSinglePost(@Req() request: Request) {
        return await this.postService.editAPost(request.params.postId, request["userDetails"].userId, request.body);
    }

    @Delete(":postId")
    @ApiParam({
        name: "postId",
        description: "The post id of the post",
        schema: {
            type: "string"
        }
    })
    async deleteSinglePost(@Req() request: Request) {
        return await this.postService.deleteAPost(request.params.postId, request["userDetails"].userId);
    }
}
