import type { Relation } from 'typeorm';
import { Major } from './major.entity.js';
export declare class Faculty {
    id: number;
    faculty_name: string;
    majors: Relation<Major[]>;
}
