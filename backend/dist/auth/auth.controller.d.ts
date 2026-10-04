import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            first_name: string;
            last_name: string;
            role: import("../users/enums/user-role.enum.js").UserRole;
        };
    }>;
}
