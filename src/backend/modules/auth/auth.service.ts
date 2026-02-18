import { UserService } from "../user/user.service";
import { LoginDto } from "./dto/login.dto";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export class AuthService {


    private readonly userService = new UserService();

    async login(payload: LoginDto) {

        const { email, password } = payload;

        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error("Invalid email or password");
        }

        return user;
    }


    async forgotPassword(email: string) {
        const user = await this.userService.findByEmail(email);

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
        await this.userService.update(user._id, {
            resetPasswordToken: null,
            resetPasswordExpires: null,
        });


        // Save new token + expiry (15 minutes)
        await this.userService.update(user._id, {
            resetPasswordToken: hashedToken,
            resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000),
        });


        return {
            message: "Reset link sent to your email, please check your inbox",
            resetToken, // send this via email
        };
    }

    async resetPasswordByToken(token: string, password: string) {

        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        console.log(token, "token");
        const user = await this.userService.findByResetPasswordToken(hashedToken);

        console.log(user, "user");

        if (!user) {
            throw new Error("Invalid or expired token");
        }

        console.log(user.resetPasswordExpires);
        console.log(new Date());

        if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
            throw new Error("Token expired");
        }


        await this.userService.update(user._id, {
            password,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        });

        return {
            message: "Password reset successfully",
        };

    }
}