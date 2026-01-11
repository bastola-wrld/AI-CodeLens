import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('conversations')
@UseGuards(JwtAuthGuard)
export class ConversationsController {
    constructor(private readonly conversationsService: ConversationsService) { }

    @Post()
    async create(@Req() req: any, @Body() body: { title?: string }) {
        return this.conversationsService.create(req.user.userId, body.title);
    }

    @Get()
    async findAll(@Req() req: any) {
        return this.conversationsService.findAllByUser(req.user.userId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.conversationsService.findOne(id);
    }
}
