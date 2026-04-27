import { CreateTagDto } from "../../DTOs/tags/CreateTagDto";
import { Tag } from "../../models/Tag";

export interface ITagRepository {
    create(dto: CreateTagDto): Promise<Tag>;
    delete(id: number): Promise<boolean>;
    findById(id: number): Promise<Tag>;
    findByName(name: string): Promise<Tag>;
}