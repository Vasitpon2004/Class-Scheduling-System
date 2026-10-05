import { Reflector } from "@nestjs/core";
import { UserRole } from "../users/enums/user-role.enum.js";

export const Roles = Reflector.createDecorator<UserRole[]>();