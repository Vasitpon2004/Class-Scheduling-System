import { UserRole } from "../users/enums/user-role.enum.js";
export interface JwtUser {
    userId: number;
    role: UserRole;
}
