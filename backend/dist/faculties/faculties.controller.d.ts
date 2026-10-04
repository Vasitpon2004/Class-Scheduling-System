import { FacultiesService } from './faculties.service.js';
export declare class FacultiesController {
    private readonly facultiesService;
    constructor(facultiesService: FacultiesService);
    findAll(): Promise<import("./entities/faculty.entity.js").Faculty[]>;
    findOne(id: number): Promise<import("./entities/faculty.entity.js").Faculty>;
}
