import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto, SignUpDto } from './dto/auth';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService, private readonly jwtService: JwtService) {}
    
    // Sign up method
    async signUp(data: SignUpDto) {
        const userAlreadyExists = await this.prismaService.user.findUnique({
            where: { email: data.email },
        });

        if (userAlreadyExists) {
            throw new UnauthorizedException('User with this email already exists');
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await this.prismaService.user.create({
            data: {
                ...data,
                password: hashedPassword, // Store hashed password
            },
        });

        // Console for viewing created user (excluding password)
        console.log('Signing up user:', user);

        return {
            id: user.id,
            email: user.email,
            name: user.name,
        }
    }

    // Sign in method
    async signIn(data: SignInDto) {
        const user = await this.prismaService.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const passwordsMatch = await bcrypt.compare(data.password, user.password);

        if (!passwordsMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = await this.jwtService.signAsync({
            userId: user.id,
            name: user.name,
            email: user.email
        });

        // Console for viewing signed-in user (excluding password)
        console.log('Signing in user:', user);

        return { token };
    }
}
