import { Repository } from 'typeorm';
import { OtpVerify } from './entities/otp-verify.entity.js';
export declare class OtpService {
    private otpRepository;
    private readonly logger;
    constructor(otpRepository: Repository<OtpVerify>);
    createForUser(userId: number): Promise<string>;
    verify(userId: number, code: string): Promise<void>;
}
