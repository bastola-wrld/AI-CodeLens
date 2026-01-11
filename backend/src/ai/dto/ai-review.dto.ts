import { IsString, IsNotEmpty, IsUUID, IsOptional, MaxLength } from 'class-validator';

export class AiReviewDto {
    @IsUUID()
    @IsNotEmpty()
    conversationId: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(100000)
    code: string;

    @IsString()
    @IsOptional()
    language?: string;
}
