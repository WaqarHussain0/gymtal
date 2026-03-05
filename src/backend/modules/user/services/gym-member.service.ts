import { onboardGymMemberEmailTemplate } from "@/constants/email-templates/member-onboard.email-template";
import { MembershipPeriodService } from "../../membership-period/membership-period.service";
import { PaymentTransactionService } from "../../payment-transaction/payment-transaction.service";
import { CreateUserDto } from "../dto/create-user.dto";
import { UserRoleEnum } from "../entity/user.entity";
import { UserService } from "./user.service";
import mongoose from "mongoose";
import { sendEmail } from "@/lib/email.util";
import { after } from "next/server";

const userService = new UserService();
const membershipService = new MembershipPeriodService();
const paymentService = new PaymentTransactionService();

export class GymMemberService {
  // First-time enrollment
  async enrollNewMember(
    userDto: CreateUserDto,
    feeAmount: number,
    adminId: string,
    membershipPeriod: { startDate: Date | string; endDate: Date | string },
  ) {
    const { startDate, endDate } = membershipPeriod;
    if (!startDate || !endDate) {
      throw new Error("Membership startDate and endDate are required");
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (parsedStartDate >= parsedEndDate) {
      throw new Error("End date must be greater than start date");
    }

    // 1️⃣ Create User
    userDto.role = UserRoleEnum.MEMBER;
    const user = await userService.createUser(userDto);
    if (!user || !user._id) {
      throw new Error("Failed to create user");
    }

    // 2️⃣ Create Membership Period

    const membership = await membershipService.createMembershipPeriod({
      userId: user._id,
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      createdBy: adminId,
    });

    // 3️⃣ Create Payment Transaction
    await paymentService.createPayment({
      userId: user._id,
      membershipPeriodId: membership._id,
      amount: feeAmount,
      paymentMethod: "cash",
      receivedBy: adminId,
      paymentDate: parsedStartDate,
    });

    const html = onboardGymMemberEmailTemplate({
      userName: userDto.name,
      membershipPeriodStart: parsedStartDate,
      membershipPeriodEnd: parsedEndDate,
    });

    after(async () => {
      await sendEmail({
        to: userDto.email,
        subject: "Welcome to Gymtal!",
        html,
      });
    });

    return user;
  }

  // Renewal / next month payment
  // Renewal with explicit dates
  async renewMembership(
    userId: mongoose.Types.ObjectId,
    startDateInput: Date | string,
    endDateInput: Date | string,
    amount: number,
    adminId: string,
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
      createdBy: adminId,
    });

    // 2️⃣ Create Payment Transaction
    await paymentService.createPayment({
      userId,
      membershipPeriodId: newPeriod._id,
      amount,
      paymentMethod: "cash", // or pass from controller if needed
      receivedBy: adminId,
      paymentDate: new Date(),
    });

    return newPeriod;
  }
}
