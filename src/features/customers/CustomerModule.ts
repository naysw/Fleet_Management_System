import { Module } from '@nestjs/common';
import { CustomerController } from './controllers/CustomerController';
import { CustomerRepository } from './repositories/CustomerRepository';
import { CustomerService } from './services/CustomerService';

@Module({
  imports: [],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerRepository],
})
export class CustomerModule {}
