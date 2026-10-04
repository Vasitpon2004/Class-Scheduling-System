import type { Relation } from 'typeorm';
import { Faculty } from './faculty.entity.js';
export declare class Major {
    id: number;
    major_name: string;
    faculty: Relation<Faculty>;
}
