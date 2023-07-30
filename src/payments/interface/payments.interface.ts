export interface IPayments extends Document {
    readonly name: string;
    readonly email: string;
    readonly status: string;
    readonly amount: number;
    readonly billingReference: string;
    readonly date: Date;
}