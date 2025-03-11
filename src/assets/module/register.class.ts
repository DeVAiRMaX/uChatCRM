export class Register {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;

    constructor(obj?: any) {
        this.firstName = obj ? obj.firstName : '';
        this.lastName = obj ? obj.lastName : '';
        this.email = obj ? obj.email : '';
        this.password = obj ? obj.password : '';
        this.confirmPassword = obj ? obj.confirmPassword : '';
    }

    public toJson(): any {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
            confirmPassword: this.confirmPassword
        }
    }

}
