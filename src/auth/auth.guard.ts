import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "./constants";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Token not found');
        }

        try {
            const payload = this.jwtService.verifyAsync(token, {
                secret: jwtConstants.secret,
            });

            // Attach user info to request object
            request['user'] = payload;
        } catch {
            throw new UnauthorizedException('Invalid token');
        }

        return true;
    }

    // Helper method to extract token from Authorization header
    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers['authorization']?.split(' ');
        return type === 'Bearer' ? token : undefined;
    }
}