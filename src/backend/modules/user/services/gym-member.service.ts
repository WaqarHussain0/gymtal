import { MembershipPeriodService } from "../../membership-period/membership-period.service";
import { PaymentTransactionService } from "../../payment-transaction/payment-transaction.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserRoleEnum } from "../entity/user.entity";
import { UserService } from "./user.service";

const userService = new UserService();
const membershipService = new MembershipPeriodService();
const paymentService = new PaymentTransactionService();

export class GymMemberService {


    // First-time enrollment
    async enrollNewMember(userDto: CreateUserDto, feeAmount: number, adminId: string) {
        // 1️⃣ Create User
        userDto.role = UserRoleEnum.MEMBER;
        const user = await userService.createUser(userDto);

        // 2️⃣ Create Membership Period
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(startDate.getMonth() + 1);

        const membership = await membershipService.createMembershipPeriod({
            userId: user._id,
            startDate,
            endDate,
            createdBy: adminId
        });

        // 3️⃣ Create Payment Transaction
        await paymentService.createPayment({
            userId: user._id,
            membershipPeriodId: membership._id,
            amount: feeAmount,
            paymentMethod: 'cash',
            receivedBy: adminId,
            paymentDate: startDate
        });

        return user;
    }

    // Renewal / next month payment
    // Renewal with explicit dates
    async renewMembership(
        userId: string,
        startDateInput: Date | string,
        endDateInput: Date | string,
        amount: number,
        adminId: string
    ) {
        const startDate = new Date(startDateInput);
        const endDate = new Date(endDateInput);

        // Basic validation
        if (endDate <= startDate) {
            throw new Error("End date must be after start date");
        }

        if (amount <= 0) {
            throw new Error("Amount must be greater than 0");
        }

        // 1️⃣ Create Membership Period
        const newPeriod = await membershipService.createMembershipPeriod({
            userId,
            startDate,
            endDate,
            createdBy: adminId
        });

        // 2️⃣ Create Payment Transaction
        await paymentService.createPayment({
            userId,
            membershipPeriodId: newPeriod._id,
            amount,
            paymentMethod: "cash", // or pass from controller if needed
            receivedBy: adminId,
            paymentDate: new Date()
        });

        return newPeriod;
    }


}