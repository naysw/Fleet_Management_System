import { Module } from '@nestjs/common';
import { CustomerController } from './controllers/CustomerController';
import { CustomerService } from './services/CustomerService';

@Module({
  imports: [],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
