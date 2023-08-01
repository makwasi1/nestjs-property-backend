import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentSchema } from 'src/schema/payment.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwt_config } from 'src/config';
// import { JwtStrategy } from './jwt-strategy';


@Module({ 
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false
    }),
    JwtModule.register({
      secret: jwt_config.secret,
      signOptions: {
        expiresIn: jwt_config.expired
      }
    }),
    MongooseModule.forFeature([{ name: 'Payments', schema: PaymentSchema }])],
  controllers: [PaymentsController],
  providers: [PaymentsService]
})
export class PaymentsModule {}
