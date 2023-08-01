export interface IPayments extends Document {
    readonly name: string;
    readonly userId: string;
    readonly status: string;
    readonly amount: number;
    readonly billingReference: string;
    readonly date: Date;
}