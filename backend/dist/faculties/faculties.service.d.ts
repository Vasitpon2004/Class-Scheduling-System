import { Repository } from 'typeorm';
import { Faculty } from './entities/faculty.entity.js';
export declare class FacultiesService {
    private facultyRepository;
    constructor(facultyRepository: Repository<Faculty>);
    findAll(): Promise<Faculty[]>;
    findOne(id: number): Promise<Faculty>;
}
