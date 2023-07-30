import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentSchema } from 'src/schema/payment.schema';


@Module({ 
  imports: [MongooseModule.forFeature([{ name: 'Payments', schema: PaymentSchema }])],
  controllers: [PaymentsController],
  providers: [PaymentsService]
})
export class PaymentsModule {}
