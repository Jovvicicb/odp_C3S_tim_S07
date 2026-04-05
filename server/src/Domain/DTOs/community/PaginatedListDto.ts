export class PaginatedListDto<T> {
  constructor(
    public items: T[]      = [],
    public total: number   = 0,
    public page: number    = 1,
    public limit: number   = 20,
  ) {}
}
