import connectToDB from "@/backend/utils/database.util";
import { CreateUserDto } from "../dto/create-user.dto";
import UserEntity, { UserRoleEnum } from "../entity/user.entity";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { sendEmail } from "@/lib/email.util";
import { onboardAdminEmailTemplate } from "@/constants/email-templates/admin-onboard.email-template";
// import PaymentTransactionEntity from "../../payment-transaction/entity/PaymentTransaction.entity";
// import MembershipPeriodEntity from "../../membership-period/entity/MembershipPeriod.entity";

export class UserService {
  private readonly userEntity = UserEntity;
  // private readonly paymentEntity = PaymentTransactionEntity;
  // private readonly membershipEntity = MembershipPeriodEntity;

  async findById(id: mongoose.Types.ObjectId) {
    await connectToDB();
    const user = await this.userEntity
      .findById(id)
      .populate({
        path: "membershipPeriods",
        options: { sort: { startDate: -1 } },
        populate: {
          path: "createdBy",
          select: "name role", // optional
        },
      })
      .populate({
        path: "paymentTransactions",
        options: { sort: { paymentDate: -1 } },
        populate: {
          path: "receivedBy",
          select: "name role", // optional
        },
      })
      .lean({ virtuals: true });

    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }

    return user;
  }

  // Find a user by email
  async findByEmail(email: string) {
    await connectToDB();
    return await this.userEntity.findOne({
      email: email?.trim()?.toLowerCase(),
    });
  }

  // Create a new user (admin/staff/member)
  async createUser(payload: CreateUserDto) {
    const { name, email, password, role, phone, gender } = payload;

    await connectToDB();

    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new Error(
        `User with email ${email} already exists, please use a different email.`,
      );
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Default role to MEMBER if not provided (optional: can force in controller)
    const userRole = role || UserRoleEnum.MEMBER;

    if (userRole !== UserRoleEnum.MEMBER && password) {
      const loginPageLink = `${process.env.NEXTAUTH_URL}/login`;

      // prepare email template
      const html = onboardAdminEmailTemplate({
        loginPageLink,
        password,
        userEmail: email.trim().toLowerCase(),
        userName: name,
        userRole: role as string,
      });

      await sendEmail({
        to: email,
        subject: "Password Reset Request",
        html,
      });
    }

    return await this.userEntity.create({
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: userRole,
      phone: phone || undefined,
      gender: gender || undefined,
    });
  }

  // Update a user
  async updateUser(id: string, payload: Partial<CreateUserDto>) {
    const { name, email, role, phone, gender } = payload;
    await connectToDB();
    if (email) {
      const existingUser = await this.findByEmail(email);
      if (existingUser && existingUser._id.toString() !== id) {
        throw new Error(
          `User with email ${email} already exists, please use a different email.`,
        );
      }
    }

    const updateData: any = { name, email, role, phone, gender };

    const updatedUser = await this.userEntity.findByIdAndUpdate(
      id,
      updateData,
      { new: true }, // return updated document
    );

    if (!updatedUser) {
      throw new Error(`User with id ${id} not found`);
    }

    return updatedUser;
  }

  // Find all users with optional search & pagination
  async findAll({
    search,
    page = 1,
    limit = 10,
    role,
  }: {
    search?: string;
    page?: number;
    limit?: number;
    role?: UserRoleEnum;
  }) {
    await connectToDB();

    // If role is provided, use it; otherwise default to non-member
    const query: Record<string, any> = role
      ? { role } // specific role from payload
      : { role: { $ne: UserRoleEnum.MEMBER } }; // default: non-members

    if (search) {
      query["$or"] = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const totalRecords = await this.userEntity.countDocuments(query);

    const data = await this.userEntity
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const serializedUsers = data.map((user) => ({
      ...user,
      _id: user._id.toString(),
      createdAt: user.createdAt?.toISOString?.() || user.createdAt,
      updatedAt: user.updatedAt?.toISOString?.() || user.updatedAt,
    }));

    const totalPages = Math.ceil(totalRecords / limit);

    return { data: serializedUsers, meta: { page, totalRecords, totalPages } };
  }

  // Delete a user
  async deleteUser(id: string) {
    await connectToDB();
    const deletedUser = await this.userEntity.findByIdAndDelete(id);

    if (!deletedUser) {
      throw new Error(`User with id ${id} not found`);
    }

    // await Promise.all([
    //   this.membershipEntity.deleteMany({ userId: id }),
    //   this.paymentEntity.deleteMany({ userId: id }),
    // ]);

    return deletedUser;
  }

  async update(
    id: mongoose.Types.ObjectId,
    payload: Partial<{
      name: string;
      email: string;
      password: string;
      role: string;
      phone: string;
      gender: string;
      resetPasswordToken: string | null;
      resetPasswordExpires: Date | null;
    }>,
  ) {
    await connectToDB();
    const updateData: any = { ...payload }; // Normalize email if provided

    // Normalize email if provided
    if (payload.email) {
      updateData.email = payload.email.trim().toLowerCase();
    }

    // Hash password if provided
    if (payload.password) {
      updateData.password = await bcrypt.hash(payload.password, 10);
    }

    const updatedUser = await this.userEntity.findByIdAndUpdate(
      id,
      updateData,
      { new: true },
    ); // return updated document
    if (!updatedUser) {
      throw new Error(`User with id ${id} not found`);
    }
    return updatedUser;
  }

  // Find user by reset password token
  async findByResetPasswordToken(token: string) {
    await connectToDB();
    return await this.userEntity.findOne({ resetPasswordToken: token });
  }

  // Get count of users - admin, staff, member
  async getCountByRole() {
    await connectToDB();

    const result = await this.userEntity.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    let adminUsers = 0;
    let staffUsers = 0;
    let memberUsers = 0;

    result.forEach((item) => {
      if (item._id === "admin") adminUsers = item.count;
      if (item._id === "staff") staffUsers = item.count;
      if (item._id === "member") memberUsers = item.count;
    });

    return { adminUsers, staffUsers, memberUsers };
  }
}
