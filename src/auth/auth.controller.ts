import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { SignInDto, SignUpDto } from './dto/auth';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    // POST /auth/signup
    @Post('signup')
    async signUp(@Body() body: SignUpDto) {
        return this.authService.signUp(body);
    }

    // POST /auth/signin
    @Post('signin')
    async signIn(@Body() body: SignInDto) {
        return this.authService.signIn(body);
    }

    // GET /auth/me
    @UseGuards(AuthGuard)
    @Get('me')
    async me(@Request() req) {
        return req.user;
    }
}
