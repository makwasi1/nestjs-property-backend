export class ProfileDto {
    profilepicture: any;

    constructor(object:any) {
        this.email = object.email;
        this.name = object.name;
        this.surname = object.surname;
        this.phone = object.phone;
        this.birthdaydate = object.birthdaydate;
        this.phone = object.phone;
        this.profilePic = object.profilepicture;
    }

    readonly name: string;
    readonly surname: string;
    readonly email: string;
    readonly phone: string;
    readonly birthdaydate: Date;
    readonly profilePic: string;
}