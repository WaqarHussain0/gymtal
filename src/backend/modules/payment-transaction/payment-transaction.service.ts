import { CreatePaymentDto } from "./dto/create-payment.dto";
import PaymentTransactionEntity from "./entity/PaymentTransaction.entity";


export class PaymentTransactionService {
    private readonly paymentEntity = PaymentTransactionEntity;

    async createPayment(data: CreatePaymentDto) {
        return await this.paymentEntity.create(data);
    }
}
