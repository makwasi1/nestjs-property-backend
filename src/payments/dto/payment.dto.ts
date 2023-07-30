//create a payment dtoe
export class PaymentDto {
    readonly amount: string;
    readonly currency: string;
    readonly description: string;
    readonly email: string;
    status: string;
    billingReference: string;
}
