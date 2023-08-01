import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentDto } from './dto/payment.dto';
import { IResponse } from 'src/interface/reponse.interface';
import { ResponseSuccess } from 'src/dto/response.dto';
import { AuthGuard } from './auth.guard';


@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentService: PaymentsService) { }

    @Post('create/billing-request')
    @UseGuards(AuthGuard)
    async createBillingRequest(@Body() paymentDto: PaymentDto) {
        try {
            let billingReference = await this.paymentService.createBillingRequest(paymentDto);
            let paymentLink = await this.paymentService.createPaymentLink(billingReference);
            return new ResponseSuccess("BILLING.REQUEST_CREATED", paymentLink)
        } catch (error) {
            return new ResponseSuccess("BILLING.REQUEST_NOT_CREATED", error)
        }

    }

    @Get('user-payments/:email')
    async findByEmail(@Param() param: any): Promise<IResponse> {
        try {
            let user = await this.paymentService.findByEmail(param.email);
            return new ResponseSuccess("USER.FOUND", user)
        } catch (error) {
            return new ResponseSuccess("USER.NOT_FOUND", error)
        }
    }

    @Post('create/payment-link')
    async createPaymentLink(@Body() paymentDto: PaymentDto) {
        try {
            let paymentLink = await this.paymentService.createPaymentLink(paymentDto.billingReference);
            return new ResponseSuccess("PAYMENT.LINK_CREATED", paymentLink)
        } catch (error) {
            return new ResponseSuccess("PAYMENT.LINK_NOT_CREATED", error)
        }

    }

}
