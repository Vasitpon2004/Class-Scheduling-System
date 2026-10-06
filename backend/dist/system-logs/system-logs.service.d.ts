import { Repository } from 'typeorm';
import { SystemLog } from './entities/system-log.entity.js';
import { LogAction } from './enums/log-action.enum.js';
export declare class SystemLogsService {
    private SystemLogRepository;
    constructor(SystemLogRepository: Repository<SystemLog>);
    record(params: {
        action: LogAction;
        actor_user_id: number | null;
        target_user_id?: number | null;
        detail?: string | null;
    }): Promise<void>;
}
