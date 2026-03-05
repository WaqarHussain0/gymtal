import { sendEmail } from "@/lib/email.util";
import { UserService } from "../user/services/user.service";
import { LoginDto } from "./dto/login.dto";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { forgotPasswordEmailTemplate } from "@/constants/email-templates/forgot-password.email-template";
import { after } from "next/server";

const userService = new UserService();
export class AuthService {
  async login(payload: LoginDto) {
    const { email, password } = payload;

    const user = await userService.findByEmail(email);

    if (!user || !user.password) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    return user;
  }

  async forgotPassword(email: string) {
    const user = await userService.findByEmail(email);

    if (!user) {
      throw new Error("Please enter a valid email address");
    }

    //  Generate raw token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Delete existing reset token (if exists)
    await userService.update(user._id, {
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    // Save new token + expiry (15 minutes)
    await userService.update(user._id, {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000),
    });

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // prepare email template
    const html = forgotPasswordEmailTemplate({
      resetPasswordLink: resetLink,
      userName: user.name || "there",
    });

    after(async () => {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        html,
      });
    });

    return {
      message: "Reset link sent to your email, please check your inbox",
    };
  }

  async resetPasswordByToken(token: string, password: string) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userService.findByResetPasswordToken(hashedToken);

    if (!user || !user._id) {
      throw new Error("Invalid or expired token");
    }

    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      throw new Error("Token expired");
    }

    await userService.update(user._id, {
      password,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return {
      message: "Password reset successfully",
    };
  }
}
