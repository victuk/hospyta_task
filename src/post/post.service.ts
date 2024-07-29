import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateDocument, PaginateModel } from 'mongoose';
import { PostCommentDTO, PostDTO, PostVoteDTO } from 'src/dtos/post.dto';
import { Comment } from 'src/schemas/commentSchema';
import { Post, PostSchemaType } from 'src/schemas/postSchema';
import { Vote } from 'src/schemas/voteSchema';
import paginate from 'mongoose-paginate-v2';

@Injectable()
export class PostService {

    constructor(
        @InjectModel(Post.name) private PostModel: Model<Post> & PaginateModel<Post>,
        @InjectModel(Comment.name) private CommentModel: Model<Comment> & PaginateModel<Comment>,
        @InjectModel(Vote.name) private VoteModel: Model<Vote> & PaginateModel<Vote>
    ) {}

    async getPostsByType(category: string, page: number = 1, limit: number = 10, userId: string) {

        let posts: any;

        if (category == "all") {
            posts = await this.PostModel.paginate({}, {page, limit, populate: [
                {
                    select: "fullName username",
                    path: "createdBy"
                }
            ]});
        } else {
            posts = await this.PostModel.paginate({category}, {page, limit});
        }

        if(posts.docs.length == 0) {
            return [];
        }

        const postVotersId = posts.docs.map((p: any) => p._id);

        const postVoters = await this.VoteModel.find({
            post: {
                $in: postVotersId
            }
        });

        const postComments = await this.CommentModel.find({
            post: {
                $in: postVotersId
            },
            inResponseTo: null
        });

        const parsedPost = JSON.parse(JSON.stringify(posts));

        for (let post of parsedPost.docs) {
            post.myVote = postVoters.find(voter => voter.post == post._id && (voter.createdBy).toString() == userId)
        }

        for (let post of parsedPost.docs) {
            post.commentCount = postComments.filter(comment => comment.post == post._id);
        }

        return parsedPost;

    }

    async addAPost(postDetails: PostDTO, userId: string) {

        const newPost = await this.PostModel.create({
            ...postDetails,
            createdBy: userId
        });

        return {
            message: "Post created",
            newPost
        }

    }

    async getAPost(postId: string) {

        console.log(postId);

        const post = await this.PostModel.findById(postId);

        const comments = await this.CommentModel.find({post: postId});

        return {
            post,
            comments
        }

    }

    async editAPost(postId: string, userId: string, updatedPostDetails: PostDTO) {
        const postToBeEdited = await this.PostModel.findById(postId);

        if ((postToBeEdited.createdBy).toString() != userId) {
            throw new Error("You are not authorized to make this change");
        }

        const updatedPost = await this.PostModel.findByIdAndUpdate(postId, updatedPostDetails, {new: true});

        return {
            message: "Post updated successfully",
            updatedPost
        }

    }

    async deleteAPost(postId: string, userId: string) {
        const postToBeEdited = await this.PostModel.findById(postId);

        if ((postToBeEdited.createdBy).toString() != userId) {
            throw new Error("You are not authorized to make this change");
        }

        await this.PostModel.findByIdAndDelete(postId);
        await this.VoteModel.deleteMany({post: postId});
        await this.CommentModel.deleteMany({post: postId});

        return "Post deleted";

    }

    async addAComment(commentDetails: PostCommentDTO, userId: string) {

        return await this.CommentModel.create({
            ...commentDetails,
            createdBy: userId
        });

    }

    async voteAPost(voteDetails: PostVoteDTO, userId: string) {

        const alreadyVoted = await this.VoteModel.exists(voteDetails);

        if(alreadyVoted) {
            throw new Error("You have already voted");
        }

        await this.VoteModel.create({
            ...voteDetails,
            createdBy: userId
        });

        switch (voteDetails.voteType) {
            case "upvote":
                await this.PostModel.findByIdAndUpdate(voteDetails.post, {
                    $inc: {upVoteCount: 1}
                });

                if(await this.VoteModel.exists({post: voteDetails.post, createdBy: userId, voteType: "downvote"})) {

                    await this.PostModel.findByIdAndUpdate(voteDetails.post, {
                        $inc: {downVoteCount: -1}
                    });

                    await this.VoteModel.deleteMany({
                        post: voteDetails.post,
                        createdBy: userId,
                        voteType: "downvote"
                    });
                }
                break;
            case "downvote":
                await this.PostModel.findByIdAndUpdate(voteDetails.post, {
                    $inc: {downVoteCount: 1}
                });

                if(await this.VoteModel.exists({post: voteDetails.post, createdBy: userId, voteType: "upvote"})) {

                    await this.PostModel.findByIdAndUpdate(voteDetails.post, {
                        $inc: {upVoteCount: -1}
                    });

                    await this.VoteModel.deleteMany({
                        post: voteDetails.post,
                        createdBy: userId,
                        voteType: "upvote"
                    });
                }

                break;
        }

        const updatedPost = await this.PostModel.findById(voteDetails.post);

        return {
            message: "Post Updated",
            updatedPost
        }
    }

    async likeAComment() {}

}
