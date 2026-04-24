export class UpdateMeDto{
    constructor(
        public username?: string,
        public email?: string,
        public password?: string,
        public fullname?: string | null,
        public bio?: string | null,
        public profilePicture?: string | null
    ){}
}


