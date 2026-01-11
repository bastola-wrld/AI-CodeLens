import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async signup(email: string, pass: string) {
        const existing = await this.usersService.findByEmail(email);
        if (existing) {
            throw new ConflictException('Email already exists');
        }
        const hash = await bcrypt.hash(pass, 10);
        const user = await this.usersService.create(email, hash);
        return { id: user.id, email: user.email };
    }

    async login(email: string, pass: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException();
        }
        const isMatch = await bcrypt.compare(pass, user.password_hash);
        if (!isMatch) {
            throw new UnauthorizedException();
        }
        const payload = { email: user.email, sub: user.id };
        return {
            accessToken: this.jwtService.sign(payload),
            user: { id: user.id, email: user.email },
        };
    }
}
