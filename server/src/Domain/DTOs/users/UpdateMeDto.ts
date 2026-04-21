export class UpdateMeDto{
    constructor(
        public username?: string,
        public email?: string,
        public password?: string,
        public fullname?: string,
        public bio?: string,
        public profilePicture?: string
    ){}
}


