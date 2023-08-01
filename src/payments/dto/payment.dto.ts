//create a payment dtoe
export class PaymentDto {
    readonly userId: string;
    readonly amount: string;
    readonly currency: string;
    readonly description: string;
    status: string;
    billingReference: string;
}
