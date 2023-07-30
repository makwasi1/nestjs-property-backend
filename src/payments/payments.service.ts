import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IPayments } from './interface/payments.interface';
import { Model } from 'mongoose';
import { PaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentsService {

    constructor(@InjectModel('Payments') private paymentModel: Model<IPayments>) { }


    async findByEmail(email: string): Promise<IPayments> {
        return await this.paymentModel.findOne({ email: email }).exec();
    }

    async createBillingRequest(paymentDto: PaymentDto): Promise<string> {
        const client = await this.gcClient();
        // Create a new payment.
        try {
            const billingRequest = await client.billingRequests.create({
                payment_request: {
                    description: paymentDto.description,
                    amount: paymentDto.amount,
                    currency: paymentDto.currency,
                    app_fee: "500",
                },
                mandate_request: {
                    scheme: "bacs"
                }
            });
            //save the billing request to the database
            paymentDto.billingReference = billingRequest.id;
            paymentDto.status = billingRequest.status;
            const newPayment = new this.paymentModel(paymentDto);
            await newPayment.save();
            return paymentDto.billingReference;
        } catch (error) {
            throw error;
        }
    }

    //create a paymet link 
    async createPaymentLink(billingReference: string): Promise<String> {
        const client = await this.gcClient();

        try {
            const paymentLink = await client.billingRequestFlows.create({
                redirect_uri: "https://aesari.com/landing",
                exit_uri: "https://aesari.com",
                links: {
                    billing_request: billingReference,
                }
            });
            return paymentLink.authorisation_url;
        } catch (error) {
            throw error;
        }
    }



    async gcClient() {
        const gocardless = require('gocardless-nodejs');
        const constants = require('gocardless-nodejs/constants');
        // Initialise the client.
        const client = gocardless(
            process.env.GC_ACCESS_TOKEN,
            constants.Environments.Sandbox,
            { raiseOnIdempotencyConflict: true }
        );
        return client;
    }
}
