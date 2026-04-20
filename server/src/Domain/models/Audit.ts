export class Audit {
    constructor(
        public id: number = 0,
        public userId: number | null = null,
        public action: string = '',
        public details: string = '',
        public ipAddress: string = '',
        public createdAt: Date = new Date()
    ) {}
}