import { CreateTagDto } from "../../DTOs/tags/CreateTagDto";
import { Tag } from "../../models/Tag";

export interface ITagRepository {
    findByIds(ids: number[]): Promise<Tag[]>;
    create(dto: CreateTagDto): Promise<Tag>;
    delete(id: number): Promise<boolean>;
    findById(id: number): Promise<Tag>;
    findByName(name: string): Promise<Tag>;
    findAll(page: number, limit: number): Promise<{ tags: Tag[]; total: number }>;
}