export class User {
    firstName: string;
    lastName: string;
    email: string;
    birthday: string;
    street: string;
    zipCode: string;
    city: string;

    constructor(obj?: any) {
        this.firstName = obj ? obj.firstName : ''; // if obj is not null, then use obj.firstName, otherwise use ''
        this.lastName = obj ? obj.lastName : '';
        this.email = obj ? obj.email : '';
        this.birthday = obj ? obj.birthday : '';
        this.street = obj ? obj.street : '';
        this.zipCode = obj ? obj.zipCode : '';
        this.city = obj ? obj.city : '';
    }

    public toJson(): any {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            birthday: this.birthday,
            street: this.street,
            zipCode: this.zipCode,
            city: this.city
        };
    }
}
