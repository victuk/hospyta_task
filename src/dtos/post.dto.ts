import { ApiProperty } from "@nestjs/swagger";
import {IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator"
import { voteTypeList } from "src/schemas/voteSchema";
import { postCategory } from "src/schemas/postSchema";

export class PostDTO {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    title: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    body: string;

    @IsString()
    @IsOptional()
    @ApiProperty()
    image?: string;

    @IsString()
    @IsNotEmpty()
    @IsEnum(postCategory)
    @ApiProperty()
    category: string;

}

export class PostCommentDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    createdBy: string;
    
    @IsString()
    @IsOptional()
    @ApiProperty()
    inResponseTo?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    post: string;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    comment: string;

}


export class PostVoteDTO {

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    post: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    @IsEnum(voteTypeList)
    voteType: string;

}
